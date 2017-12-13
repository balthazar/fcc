const path = require('path')
const fs = require('fs')
const _ = require('lodash')
const { format } = require('date-fns')

const db = require('./db')

const stars = db.get('stars').value().filter(s => s.user.starredRepositories.totalCount > 1)

const dates = stars.map(o => new Date(o.starredAt))

const grouped = _.groupBy(dates, d => format(d, 'DD/MM/YYYY'))
const byDay = Object.keys(grouped).reduce((acc, date, i) => {
  const count = grouped[date].length
  return acc.concat({ date, stars: count, total: i === 0 ? count : count + acc[i - 1].total })
}, [])

fs.writeFileSync(path.join(__dirname, '../data/normalized.json'), JSON.stringify(byDay), 'utf8')
