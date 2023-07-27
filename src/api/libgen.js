const libgen = require('libgen')
const Bottleneck = require('bottleneck')
const fuzzball = require('fuzzball')

const LIBGEN_URL = 'http://libgen.is'
const LIBRARY_URL = 'http://library.lol/main/'

const limiter = new Bottleneck({
  maxConcurrent: 1,
  minTime: 2000,
})

let currentTask = null

async function searchLibgen(title, author, retryCount = 5) {
  if (currentTask) {
    currentTask.cancel()
  }

  currentTask = createCancelableTask(
    _searchLibgen.bind(null, title, author, retryCount)
  )

  return currentTask.promise
}

function createCancelableTask(task) {
  let cancel = null

  const promise = new Promise((resolve, reject) => {
    const promise = task()
    cancel = () => {
      reject(new Error('Task was cancelled'))
    }

    promise.then(resolve, reject)
  })

  return { promise, cancel }
}

async function _searchLibgen(title, author, retryCount = 5) {
  if (!title || typeof title !== 'string') throw new Error('Invalid title')
  if (!author || typeof author !== 'string') throw new Error('Invalid author')
  title = title.toLowerCase().trim()
  author = author.toLowerCase().trim()
  const query = `${title}`
  let offsetCount = 0

  try {
    while (retryCount > 0) {
      const options = {
        mirror: LIBGEN_URL,
        query: query,
        search_in: 'title',
        count: 20,
        offset: offsetCount,
      }
      const data = await limiter.schedule(() => libgen.search(options))
      console.log('data: ', data.length)
      let downloadLink = ''
      if (data && data.length > 0) {
        for (const item of data) {
          const title = item.title
          const bookAuthor = item.author
          let cleanedBookAuthor = bookAuthor.replace(/[^a-zA-Z0-9 ]/g, '')
          let cleanAuthor = author.replace(/[^a-zA-Z0-9 ]/g, '')
          const md5 = item.md5
          downloadLink = `${LIBRARY_URL}${md5.toLowerCase()}`
          const book = {
            title,
            cleanedBookAuthor,
            downloadLink,
          }
          let sortedBookAuthor = cleanedBookAuthor
            .toLowerCase()
            .split(' ')
            .sort()
            .join(' ')
          let sortedInputAuthor = cleanAuthor
            .toLowerCase()
            .split(' ')
            .sort()
            .join(' ')
          const score = fuzzball.ratio(sortedBookAuthor, sortedInputAuthor)
          if (score > 50) {
            console.log('Eureka!')
            return {
              downloadLink: book.downloadLink,
            }
          }
        }
      }
      retryCount--
      offsetCount += 20
      console.log('retryCount: ', retryCount)
      console.log('offSetCount: ', offsetCount)
      if (retryCount === 0) {
        console.log('No match found')
        return {
          downloadLink: null,
        }
      }
    }
  } catch (err) {
    if (err.message === 'Task was cancelled') {
      console.log('The search task was cancelled')
    } else {
      console.error(
        `An error occurred while searching for books: ${err.message}`
      )
      return { downloadLink: null }
    }
  }
}

module.exports = { searchLibgen }
