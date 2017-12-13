const db = require('./db')

const stars = db.get('stars').value()

const word = 'newyork'

const count = stars.reduce((acc, cur) => {
  if (cur.user.location && cur.user.location.toLowerCase().includes(word)) {
    return acc + 1
  }
  return acc
}, 0)

console.log(`Count of [${word}] `, count)
