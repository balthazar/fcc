const path = require('path')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const DB_PATH = path.resolve(__dirname, '../db.json')
const adapter = new FileSync(DB_PATH)

const db = low(adapter)

db.defaults({ stars: [], page: 1, lastCursor: null }).write()

module.exports = db
