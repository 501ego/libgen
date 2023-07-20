const express = require('express')
const cors = require('cors')
const serverless = require('serverless-http')
const path = require('path')
const { getFastestMirror, getDownloadLinks } = require('./libgen')
const app = express()
const port = 5000
const queryCache = {}

app.use('/assets', express.static(path.join(__dirname, '../assets')))
app.use(cors())

app.get('/search', async (req, res) => {
  const { query, category } = req.query
  let startIndex = parseInt(req.query.startIndex) || 0
  const maxResults = 20
  const mirror = await getFastestMirror()
  console.log('QUERY:', query)
  console.log('CATEGORÍA:', category)
  console.log('Resultados:')
  const cacheKey = `${query || category}|${startIndex}`

  if (queryCache[cacheKey]) {
    res.json(queryCache[cacheKey])
    return
  }

  const books = []
  const uniqueTitles = new Set()

  while (books.length < 12) {
    try {
      const searchParam = category
        ? `subject:${encodeURIComponent(category)}`
        : encodeURIComponent(query)
      const googleBooksResponse = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${searchParam}&langRestrict=en,es&startIndex=${startIndex}&maxResults=${maxResults}`
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
        console.log(item.volumeInfo.title, ' - ', item.volumeInfo.categories)

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
            cover: imageLinks
              ? imageLinks.thumbnail
              : '/.netlify/functions/assets/cover.png',
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
  res.json(books)
  console.log('búsqueda finalizada')
  console.log()
})

module.exports.handler = serverless(app)
