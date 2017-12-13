const db = require('./db')

const stars = db.get('stars').value()

const setGeo = (index, user, geo) => {
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

stars.forEach((s, index) => {
  if (!s.user.geo) {
    return
  }

  const { city, countryCode } = s.user.geo
  if (countryCode === 'US' && city === 'NYC') {
    setGeo(index, s.user, { ...s.user.geo, city: 'New York' })
  }

  if (countryCode === 'US' && city === 'SF') {
    setGeo(index, s.user, { ...s.user.geo, city: 'San Francisco' })
  }

  if (countryCode === 'US' && city === 'LA') {
    setGeo(index, s.user, { ...s.user.geo, city: 'Los Angeles' })
  }

  if (countryCode === 'BR' && city === 'SP') {
    setGeo(index, s.user, { ...s.user.geo, city: 'São Paulo' })
  }

  if (countryCode === 'BR' && city === 'BH') {
    setGeo(index, s.user, { ...s.user.geo, city: 'Belo Horizonte' })
  }

  if (countryCode === 'RU' && city === 'Moscow') {
    setGeo(index, s.user, { ...s.user.geo, city: 'Москва / Moscow' })
  }

  if (countryCode === 'RU' && city === 'Москва') {
    setGeo(index, s.user, { ...s.user.geo, city: 'Москва / Moscow' })
  }

  if (countryCode === 'RU' && city === 'Санкт-Петербург') {
    setGeo(index, s.user, { ...s.user.geo, city: 'Санкт-Петербург / St Petersburg' })
  }

  if (countryCode === 'RU' && city === 'Saint Petersburg') {
    setGeo(index, s.user, { ...s.user.geo, city: 'Санкт-Петербург / St Petersburg' })
  }

  if (countryCode === 'RU' && city === 'Екатеринбург') {
    setGeo(index, s.user, { ...s.user.geo, city: 'Екатеринбург / Yekaterinburg' })
  }

  if (countryCode === 'RU' && city === 'Новосибирск') {
    setGeo(index, s.user, { ...s.user.geo, city: 'Новосибирск / Novosibirsk' })
  }

  if (countryCode === 'RU' && city === 'Казань') {
    setGeo(index, s.user, { ...s.user.geo, city: 'Казань / Kazan' })
  }

  if (countryCode === 'RU' && city === 'Краснодар') {
    setGeo(index, s.user, { ...s.user.geo, city: 'Краснодар / Krasnodar' })
  }

  if (countryCode === 'RU' && city === 'Самара') {
    setGeo(index, s.user, { ...s.user.geo, city: 'Самара / Samara' })
  }

  if (countryCode === 'RU' && city === 'Владивосток') {
    setGeo(index, s.user, { ...s.user.geo, city: 'Владивосток / Vladivostok' })
  }

  if (countryCode === 'RU' && city === 'Ростов-на-Дону') {
    setGeo(index, s.user, { ...s.user.geo, city: 'Ростов-на-Дону / Rostov-on-Don' })
  }

  if (countryCode === 'RU' && city === 'Пермь') {
    setGeo(index, s.user, { ...s.user.geo, city: 'Пермь / Perm' })
  }

  if (countryCode === 'CN' && city === 'Beijing') {
    setGeo(index, s.user, { ...s.user.geo, city: '北京市 / Beijing' })
  }

  if (countryCode === 'CN' && city === '北京市') {
    setGeo(index, s.user, { ...s.user.geo, city: '北京市 / Beijing' })
  }

  if (countryCode === 'CN' && city === 'Shanghai') {
    setGeo(index, s.user, { ...s.user.geo, city: '上海市 / Shanghai' })
  }

  if (countryCode === 'CN' && city === '上海市') {
    setGeo(index, s.user, { ...s.user.geo, city: '上海市 / Shanghai' })
  }

  if (countryCode === 'CN' && city === '深圳市') {
    setGeo(index, s.user, { ...s.user.geo, city: '深圳市 / Shenzhen' })
  }

  if (countryCode === 'CN' && city === '杭州市') {
    setGeo(index, s.user, { ...s.user.geo, city: '杭州市 / Hangzhou' })
  }

  if (countryCode === 'CN' && city === '广州市') {
    setGeo(index, s.user, { ...s.user.geo, city: '广州市 / Guangzhou' })
  }

  if (countryCode === 'CN' && city === 'Guangzhou') {
    setGeo(index, s.user, { ...s.user.geo, city: '广州市 / Guangzhou' })
  }

  if (countryCode === 'CN' && city === '成都市') {
    setGeo(index, s.user, { ...s.user.geo, city: '成都市 / Chengdu' })
  }

  if (countryCode === 'CN' && city === '南京市') {
    setGeo(index, s.user, { ...s.user.geo, city: '南京市/ Nanjing' })
  }

  if (countryCode === 'CN' && city === '武汉市') {
    setGeo(index, s.user, { ...s.user.geo, city: '武汉市 / Wuhan' })
  }

  if (countryCode === 'CN' && city === '苏州市') {
    setGeo(index, s.user, { ...s.user.geo, city: '苏州市 / Suzhou' })
  }

  if (countryCode === 'CN' && city === '重庆市') {
    setGeo(index, s.user, { ...s.user.geo, city: '重庆市 / Chongqing' })
  }
})

db.write()
