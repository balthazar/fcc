const _ = require('lodash')

const db = require('./db')
const countries = require('./countries')

const stars = db.get('stars').value()

const cities = stars.reduce((acc, cur) => {
  if (cur.user.geo && cur.user.geo.city) {
    const key = cur.user.geo.city.toLowerCase()
    const value = cur.user.geo

    if (!acc[key]) {
      acc[key] = {}
    }

    acc[key][value.countryCode.toLowerCase()] = value
  }

  return acc
}, {})

delete cities['san francisco'].co
delete cities.berlin.us
delete cities.shanghai.us
delete cities.london.ca
delete cities.melbourne.us
delete cities.moscow.us
delete cities.vancouver.us
delete cities.norwich.us
delete cities.cambridge.us
delete cities.dublin.us
delete cities.bristol.us
delete cities.bedford.us
delete cities.bedford.ca
delete cities.oakland.ca
delete cities.birmingham.us
delete cities.bogota.us
delete cities.valencia.us
delete cities.northampton.us
delete cities.halifax.ca
delete cities.pasadena.ca
delete cities.lincoln.gb
delete cities.reading.us
delete cities.durham.us
delete cities.irvine.ca
delete cities.berkeley.ca
delete cities['saint petersburg'].us
delete cities['long beach'].ca
delete cities.portsmouth.us
delete cities.kingston.us
delete cities.worcester.us
delete cities.lancaster.us
delete cities.lublin.us
delete cities.kingston.ca
delete cities.hamilton.ca
delete cities.hamilton.nz
delete cities.bangkok.id
delete cities.indiana.pe
delete cities.belmont.ca
delete cities.windsor.gb
delete cities.windsor.us
delete cities.winchester.ca
delete cities.winchester.us
delete cities.aberdeen.us
delete cities.carlisle.us
delete cities.telford.us
delete cities['niagara falls'].ca
delete cities['kuala lumpur'].id
cities.california = {
  us: { countryCode: 'US' },
}
cities.venice = {
  it: { countryCode: 'IT', city: 'Venice', latitude: 45.4046987, longitude: 12.241659 },
}

let updated = 0

const setGeo = (index, user, geo) => {
  updated++

  db
    .get('stars')
    .nth(index)
    .get('user')
    .assign({
      ...user,
      geo,
    })
    .value()
}

const indexedCountries = _.keyBy(countries, c => c.name.toLowerCase())

let unassigned = 0
let invalid = false

stars.forEach((s, index) => {
  if (s.user.geo) {
    return
  }

  if (s.user.location) {
    const lower = s.user.location.toLowerCase()
    if (cities[lower]) {
      const keys = Object.keys(cities[lower])

      if (keys.length === 1) {
        setGeo(index, s.user, cities[lower][keys[0]])
      } else {
        invalid = true
        console.log(s.user.location, cities[lower])
      }
    } else if (indexedCountries[lower]) {
      setGeo(index, s.user, { countryCode: indexedCountries[lower].code })
    } else {
      unassigned++
    }
  }
})

console.log('unassigned', unassigned)
console.log('updated', updated)

if (!invalid) {
  db.write()
}
