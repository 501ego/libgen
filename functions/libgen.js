const libgen = require('libgen')
const Bottleneck = require('bottleneck')
const _ = require('lodash')

const libgenCache = {}

const limiter = new Bottleneck({
  minTime: 100,
})

async function getFastestMirror() {
  try {
    const urlString = await limiter.schedule(() => libgen.mirror())
    return urlString
  } catch (err) {
    console.error(err)
  }
}

async function getDownloadLink(mirror, title) {
  if (libgenCache[title]) {
    return libgenCache[title]
  }
  const options = {
    mirror: mirror,
    query: title,
    count: 1,
  }
  try {
    const data = await limiter.schedule(() => libgen.search(options))
    if (data && data.length > 0) {
      const downloadLink = `http://library.lol/main/${data[0].md5.toLowerCase()}`
      libgenCache[title] = downloadLink
      return downloadLink
    }
  } catch (err) {
    console.error(err)
  }
}

async function getDownloadLinks(mirror, titles) {
  const downloadLinks = {}
  const titleChunks = _.chunk(titles, 10)
  for (const chunk of titleChunks) {
    await Promise.all(
      chunk.map(async title => {
        try {
          const link = await getDownloadLink(mirror, title)
          if (link) {
            downloadLinks[title] = link
          }
        } catch (err) {
          console.error(err)
        }
      })
    )
  }
  return downloadLinks
}

module.exports = {
  getFastestMirror,
  getDownloadLinks,
}
