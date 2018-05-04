const path = require('path')

module.exports = {
  filesDir: path.join(__dirname, '..', 'files'),
  ip: 'localhost',
  port: 3000,
  secretKey: 'plasticgui-secret',
  development: {
    host: 'localhost',
    dialect: 'sqlite',
    storage: path.join(__dirname, '..', 'database.sqlite')
  },
  "group18SearchDB_sequelize_options":{
    "database": "group18",
    "username": "root",
    "password": "",
    "host": "www.odonoghuelab.org",
    "dialect": "mysql",
    "pool": {
      "max": 5,
      "min": 0,
      "acquire": 30000,
      "idle": 10000
    },
    "define":{
      "underscored": true,
      "paranoid": true
    }
  }
}