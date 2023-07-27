const libgen = require('libgen')
const Bottleneck = require('bottleneck')

const LIBGEN_URL = 'http://libgen.is'
const LIBRARY_URL = 'http://library.lol/main/'

const limiter = new Bottleneck({
  maxConcurrent: 1,
  minTime: 500,
})
async function searchLibgen(title, author, retryCount = 5) {
  if (!title || typeof title !== 'string') throw new Error('Invalid title')
  if (!author || typeof author !== 'string') throw new Error('Invalid author')

  const query = `${title} ${author}`
  const options = {
    mirror: LIBGEN_URL,
    query: query,
    count: 30,
  }

  try {
    while (retryCount > 0) {
      const data = await limiter.schedule(() => libgen.search(options))
      let downloadLink = ''
      if (data && data.length > 0) {
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
            return {
              downloadLink: book.downloadLink,
            }
          }
        }
      }
      retryCount--
      console.log('retryCount: ', retryCount)
      if (retryCount === 0) {
        console.log('No match found')
        return {
          downloadLink: '',
        }
      }
    }
  } catch (err) {
    console.error(`An error occurred while searching for books: ${err.message}`)
    return {
      statusCode: 500,
      console: `An error occurred while searching for books: ${err.message}`,
    }
  }
}

module.exports = { searchLibgen }
