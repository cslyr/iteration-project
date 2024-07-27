const mysql = require("mysql");

// 数据库链接配置
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "123456",
  database: "resume",
});

module.exports = db;