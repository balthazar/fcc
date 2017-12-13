const db = require('./db')

const stars = db.get('stars').value()

const changeCity = (star, index, city) => {
  db
    .get('stars')
    .nth(index)
    .get('user')
    .assign({
      ...star.user,
      geo: {
        ...star.user.geo,
        city,
      },
    })
    .value()
}

stars.forEach((star, i) => {
  if (!star.user.geo) {
    return
  }

  if (star.user.geo.city === 'LA') {
    changeCity(star, i, 'Los Angeles')
  } else if (star.user.geo.city === 'SF') {
    changeCity(star, i, 'San Francisco')
  }
})

db.write()
