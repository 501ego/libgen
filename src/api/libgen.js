const libgen = require('libgen')
const Bottleneck = require('bottleneck')
const _ = require('lodash')

const LIBGEN_URL = 'http://libgen.is'
const LIBRARY_URL = 'http://library.lol/main/'

async function searchLibgen(title, author) {
  if (!title || typeof title !== 'string') {
    throw new Error('Invalid title')
  }

  if (!author || typeof author !== 'string') {
    throw new Error('Invalid author')
  }

  const options = {
    mirror: LIBGEN_URL,
    query: title,
    count: 0,
  }
  const limiter = new Bottleneck({
    maxConcurrent: 1,
    minTime: 0,
  })

  try {
    const data = await limiter.schedule(() => libgen.search(options))
    let downloadLink = ''
    let matches = []
    let otherbooks = []

    if (!Array.isArray(data)) {
      console.error(`Data is not iterable`)
      return {
        error: true,
        matches: [],
        otherbooks: [],
      }
    }

    for (const item of data) {
      const title = item.title
      const bookAuthor = Array.isArray(item.author)
        ? item.author.join(', ')
        : item.author
      const md5 = item.md5
      downloadLink = `${LIBRARY_URL}${md5.toLowerCase()}`

      const book = {
        title,
        author: bookAuthor,
        downloadLink,
      }

      if (bookAuthor.toLowerCase().includes(author.toLowerCase())) {
        console.log('Eureka!')
        matches.push(book)
      } else {
        otherbooks.push(book)
      }
    }
    return {
      error: false,
      matches: matches,
      otherbooks: otherbooks,
    }
  } catch (err) {
    console.error(`An error occurred while searching for books: ${err.message}`)
    return {
      statusCode: 500,
      error: true,
    }
  }
}

module.exports = { searchLibgen }
