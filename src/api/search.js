const axios = require('axios')

const getBooksFromGoogleAPI = async (
  searchParam,
  language,
  startIndex,
  maxResults
) => {
  try {
    const response = await axios.get(
      `https://www.googleapis.com/books/v1/volumes?q=${searchParam}&orderBy=newest&langRestrict=${language}&startIndex=${startIndex}&maxResults=${maxResults}`
    )
    return response.data.items || []
  } catch (error) {
    console.error(`Error fetching data from Google Books API: ${error.message}`)
    return null
  }
}

const formatBook = item => ({
  title: item.volumeInfo.title,
  author: item.volumeInfo.authors
    ? item.volumeInfo.authors.join(', ')
    : 'Autor desconocido',
  pages: item.volumeInfo.pageCount,
  previewLink: item.volumeInfo.previewLink,
  publishedDate: item.volumeInfo.publishedDate,
  description: item.volumeInfo.description,
  categories: item.volumeInfo.categories,
  cover: item.volumeInfo.imageLinks
    ? item.volumeInfo.imageLinks.thumbnail
    : '/assets/cover.png',
  downloadLink: '',
})

exports.handler = async function (event, context) {
  const {
    query,
    category,
    startIndex: start = '0',
    maxResults,
    language,
  } = event.queryStringParameters

  const startIndex = parseInt(start, 10)
  const maxResultsNum = parseInt(maxResults, 10)

  const searchParam = category
    ? `subject:${encodeURIComponent(category)}`
    : encodeURIComponent(query)

  const books = []
  const uniqueTitles = new Set()

  let index = startIndex

  while (books.length < 40) {
    const items = await getBooksFromGoogleAPI(
      searchParam,
      language,
      index,
      maxResultsNum
    )

    if (!items) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: 'Error fetching data from Google Books API.',
        }),
      }
    }

    if (items.length === 0) {
      console.log(
        `No se encontraron más libros para "${query}" más allá del startIndex ${index}`
      )
      break
    }

    for (const item of items) {
      if (!uniqueTitles.has(item.volumeInfo.title)) {
        uniqueTitles.add(item.volumeInfo.title)
        books.push(formatBook(item))

        if (books.length >= 40) {
          break
        }
      }
    }

    index += maxResultsNum
  }

  return {
    statusCode: 200,
    body: JSON.stringify(books),
  }
}
