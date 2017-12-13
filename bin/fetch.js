const dotenv = require('dotenv')
const fetch = require('node-fetch')

const db = require('./db')
const starq = require('./starq')

dotenv.load()

const fetchFirsts = async prevCursor => {
  const page = db.get('page').value()
  const lastCursor = prevCursor || db.get('lastCursor').value()

  console.log('[PROGRESS]', (page / 6000 * 100).toFixed(2), '%')

  const r = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    body: JSON.stringify({
      query: starq(lastCursor),
    }),
    headers: {
      Authorization: `bearer ${process.env[`GITHUB${Math.random() < 0.5 ? '1' : '2'}`]}`,
    },
  })

  const json = await r.json()

  const { data: { repository: { stargazers } } } = json
  const { stars, pageInfo: { endCursor, hasNextPage } } = stargazers

  if (stars.length !== 50) { return console.log('Reached the end!') }

  db
    .get('stars')
    .push(stars)
    .write()

  db
    .set('page', page + 1)
    .set('lastCursor', endCursor)
    .write()

  if (hasNextPage) {
    fetchFirsts(endCursor)
  }
}

fetchFirsts()

module.exports = fetchFirsts
