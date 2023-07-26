const axios = require('axios')
const { searchLibgen } = require('./libgen')
const Bottleneck = require('bottleneck')

const queryCache = {}

const limiter = new Bottleneck({
  maxConcurrent: 1,
  minTime: 1000,
})

async function handleBookSearch(item, maxResults) {
  const { title, authors, imageLinks } = item.volumeInfo
  const libgenData = await searchLibgen(title, authors[0])
  let resultBooks = []

  if (
    !libgenData.error &&
    libgenData.matches &&
    libgenData.matches.length > 0
  ) {
    const matchedBooks = libgenData.matches.map(match => ({
      title,
      author: authors ? authors.join(', ') : 'Autor desconocido',
      pages: item.volumeInfo.pageCount || 'Desconocido',
      previewLink: item.volumeInfo.previewLink,
      publishedDate: item.volumeInfo.publishedDate || 'Desconocido',
      description: item.volumeInfo.description || 'No se encontró descripción',
      categories: item.volumeInfo.categories || 'Desconocido',
      cover: imageLinks ? imageLinks.thumbnail : '/assets/cover.png',
      downloadLink: match.downloadLink,
    }))
    resultBooks.push(...matchedBooks)
  }

  if (
    !libgenData.error &&
    libgenData.otherbooks &&
    libgenData.otherbooks.length > 0
  ) {
    const otherBooksPromises = libgenData.otherbooks.map(async book => {
      const title = encodeURIComponent(book.title)
      const author = encodeURIComponent(book.author)
      const downloadLink = book.downloadLink
      const searchParam = `${author} ${title}`
      const otherBooksInGoogle = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${searchParam}&maxResults=${maxResults}`
      )
      let MoreBooks = []
      if (otherBooksInGoogle.data.items) {
        for (const item of otherBooksInGoogle.data.items) {
          if (item.volumeInfo.title === book.title) {
            MoreBooks.push({
              title: item.volumeInfo.title,
              author: item.volumeInfo.authors.join(', '),
              pages: item.volumeInfo.pageCount || 'Desconocido',
              previewLink: item.volumeInfo.previewLink,
              publishedDate: item.volumeInfo.publishedDate,
              description: item.volumeInfo.description || 'Desconocido',
              categories: item.volumeInfo.categories || 'Desconocido',
              cover: item.volumeInfo.imageLinks
                ? item.volumeInfo.imageLinks.thumbnail
                : '/assets/cover.png',
              downloadLink: downloadLink,
            })
          }
        }
      }
      return MoreBooks
    })
    const otherBooks = await Promise.all(otherBooksPromises).then(booksArrays =>
      booksArrays.flat()
    )
    resultBooks.push(...otherBooks)
  }

  return resultBooks
}

exports.handler = async function (event, context) {
  const {
    query,
    category,
    startIndex: start,
    maxResults,
    language,
  } = event.queryStringParameters
  let startIndex = parseInt(start) || 0
  const cacheKey = `${query || category}|${startIndex}|${language}`

  if (queryCache[cacheKey]) {
    return {
      statusCode: 200,
      body: JSON.stringify(queryCache[cacheKey]),
    }
  }

  let books = []
  const searchParam = category
    ? `subject:${encodeURIComponent(category)}`
    : encodeURIComponent(query)
  const googleBooksResponse = await axios.get(
    `https://www.googleapis.com/books/v1/volumes?q=${searchParam}&startIndex=${startIndex}&maxResults=${maxResults}`
  )

  let titles = new Set()

  for (const item of googleBooksResponse.data.items) {
    if (books.length >= 15) {
      break
    }
    const result = await limiter.schedule(() =>
      handleBookSearch(item, maxResults)
    )
    const newBooks = result.flat()
    for (const book of newBooks) {
      if (!titles.has(book.title)) {
        books.push(book)
        titles.add(book.title)
      }
    }
    console.log('Books found: ', books.length)
  }

  queryCache[cacheKey] = books
  console.log('Books completed: ', books.length)

  return {
    statusCode: 200,
    body: JSON.stringify(books),
  }
}
