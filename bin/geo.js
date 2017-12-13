const NodeGeocoder = require('node-geocoder')
const PQueue = require('p-queue')

const db = require('./db')

const queue = new PQueue({ concurrency: 1 })

const geocoder = NodeGeocoder({
  provider: 'google',
})

const stars = db.get('stars').value()
const toGeocode = stars.reduce((acc, cur) => {
  if (cur.user.location && !cur.user.geo) {
    return acc + 1
  }
  return acc
}, 0)

console.log(`${toGeocode} locations left to geocode`)

const cache = {}
let count = 0
let lastSuccess = null

const addToQueue = i => {
  queue
    .add(() =>
      geocoder
        .geocode(stars[i].user.location)
        .then(res => new Promise(resolve => setTimeout(() => resolve(res), 200))),
    )
    .then(res => {
      ++count
      if (res && res[0]) {
        lastSuccess = i

        console.log(`${(count / toGeocode * 100).toFixed(3)}% - ${toGeocode - count}`)
        const { countryCode, city, latitude, longitude } = res[0]

        cache[i] = {
          ...stars[i].user,
          geo: {
            countryCode,
            city,
            latitude,
            longitude,
          },
        }
      } else {
        console.log(res)
      }
    })
    .catch(err => {
      console.log(err)
      console.log('LAST SUCCESS', lastSuccess)
    })
}

const populateGeo = () => {
  for (let i = 0; i < stars.length; ++i) {
    if (stars[i].user.location && !stars[i].user.geo) {
      addToQueue(i)
    }
  }
}

populateGeo()

setInterval(() => {
  console.log('--- SAVING ---')
  console.log(cache)

  Object.keys(cache).forEach(index => {
    db
      .get('stars')
      .nth(index)
      .get('user')
      .assign(cache[index])
      .value()

    delete cache[index]
  })

  db.write()
}, 30e3)
