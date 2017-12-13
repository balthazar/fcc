const db = require('./db')

const values = db.get('stars').value()

db.set('stars', values.reduce((acc, cur) => acc.concat(cur.filter(f => f)), [])).write()
