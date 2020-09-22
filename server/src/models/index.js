'use strict'

const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const basename = path.basename(__filename)
const env = process.env.NODE_ENV || 'development'
const config = require('../config')[env]
const sequelizeConfig = require('../config').group18SearchDB_sequelize_options
const db = {};

db.Sequelize = Sequelize
db.sequelize = new Sequelize(
  sequelizeConfig.database, sequelizeConfig.username,
  sequelizeConfig.password, sequelizeConfig)

db.config = config
db.unwrapInstance =
  function (instance) {
    if (instance === null) {
      return null
    } else {
      return instance.get({ plain: true })
    }
  }

db.sequelize.define()
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js')
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(db.sequelize, Sequelize.DataTypes)
    db[model.name] = model
  })

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

async function init() {
  await db.sequelize.sync()
  console.log('> Models.init done')
}

init()

module.exports = db
