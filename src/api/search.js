const axios = require('axios')
const { getFastestMirror, getDownloadLinks } = require('./libgen')

const queryCache = {}

exports.handler = async function (event, context) {
  const {
    query,
    category,
    startIndex: start,
    maxResults,
    language,
  } = event.queryStringParameters
  let startIndex = parseInt(start) || 0
  const mirror = await getFastestMirror()
  const cacheKey = `${query || category}|${startIndex}|${language}`

  if (queryCache[cacheKey]) {
    return {
      statusCode: 200,
      body: JSON.stringify(queryCache[cacheKey]),
    }
  }
  console.log(language)

  const books = []
  const uniqueTitles = new Set()

  while (books.length < 12) {
    try {
      const searchParam = category
        ? `subject:${encodeURIComponent(category)}`
        : encodeURIComponent(query)
      const googleBooksResponse = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${searchParam}&langRestrict=${language}&startIndex=${startIndex}&maxResults=${maxResults}`
      )

      if (!googleBooksResponse.data.items) {
        console.log(
          `No se encontraron más libros para "${query}" más allá del startIndex ${startIndex}`
        )
        break
      }

      const titles = googleBooksResponse.data.items.map(
        item => item.volumeInfo.title
      )
      const downloadLinks = await getDownloadLinks(mirror, titles)

      for (const item of googleBooksResponse.data.items) {
        const { title, authors, imageLinks } = item.volumeInfo
        if (
          downloadLinks[title] &&
          !uniqueTitles.has(title) &&
          (item.volumeInfo.language === 'en' ||
            item.volumeInfo.language === 'es')
        ) {
          uniqueTitles.add(title)
          books.push({
            title,
            author: authors ? authors.join(', ') : 'Autor desconocido',
            pages: item.volumeInfo.pageCount || 'Desconocido',
            previewLink: item.volumeInfo.previewLink,
            publishedDate: item.volumeInfo.publishedDate,
            description: item.volumeInfo.description,
            categories: item.volumeInfo.categories,
            cover: imageLinks ? imageLinks.thumbnail : '/assets/cover.png',
            downloadLink: downloadLinks[title],
          })

          if (books.length >= 12) {
            break
          }
        }
      }

      if (books.length < 12) {
        startIndex += maxResults
      }
    } catch (error) {
      console.log(`Error fetching data from Google Books API: ${error.message}`)
      break
    }
  }

  if (!queryCache[query || category]) {
    queryCache[query || category] = {}
  }

  queryCache[cacheKey] = books
  return {
    statusCode: 200,
    body: JSON.stringify(books),
  }
}
