const { searchLibgen } = require('./libgen')

exports.handler = async function (event, context) {
  try {
    const { title, author } = event.queryStringParameters
    const result = await searchLibgen(title, author)
    return {
      statusCode: 200,
      body: JSON.stringify(result),
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: 'An error occurred: ' + error.toString(),
    }
  }
}
