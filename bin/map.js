const path = require('path')
const fs = require('fs')
const _ = require('lodash')

const db = require('./db')
const countries = require('./countries.json')

const latLngs = countries.reduce((acc, cur) => {
  acc[cur.cca2] = cur.latlng.reverse()
  return acc
}, {})

const stars = db.get('stars').value()
const filtered = stars.filter(s => s.user.geo)

const grouped = _.groupBy(filtered, s => s.user.geo.countryCode)
const out = Object.keys(grouped).reduce((acc, country) => {
  const count = grouped[country].length
  const cities = grouped[country].reduce((out, cur) => {
    const { city, longitude, latitude } = cur.user.geo

    if (!city) {
      return out
    }
    if (!out[city]) {
      out[city] = { latitude, longitude, count: 0 }
    }

    out[city].count++
    return out
  }, {})

  const citiesOut = Object.keys(cities)
    .sort((a, b) => cities[b].count - cities[a].count)
    .map(k => ({ name: k, ...cities[k] }))

  acc[country] = {
    count,
    center: latLngs[country],
    cities: citiesOut,
  }

  return acc
}, {})

fs.writeFileSync(path.join(__dirname, '../data/map.json'), JSON.stringify(out), 'utf8')
