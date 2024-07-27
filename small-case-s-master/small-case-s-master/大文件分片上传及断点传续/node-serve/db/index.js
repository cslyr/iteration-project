const mysql = require('mysql')

const db = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "123456",
  database: "reactdatabase",
})

module.exports = db