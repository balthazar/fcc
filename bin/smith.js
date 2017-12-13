const path = require('path')
const fs = require('fs')
const _ = require('lodash')
const { format } = require('date-fns')

const db = require('./db')

const stars = db.get('stars').value()

const grouped = _.groupBy(stars, d => format(d.starredAt, 'DD/MM/YYYY'))

const byDay = Object.keys(grouped).reduce((acc, date) => {
  const total = grouped[date].length
  const [smithes, neos] = grouped[date].reduce(
    (out, s) => (s.user.starredRepositories.totalCount === 1 ? out[0]++ : out[1]++, out),
    [0, 0],
  )

  return acc.concat({ date, total, smithes, neos })
}, [])

fs.writeFileSync(path.join(__dirname, '../data/smith.json'), JSON.stringify(byDay), 'utf8')
