/**
 * @fileoverview Centralized place to declare the main Express app and
 * Sequelize db variables so that circular references are
 * avoided when loading models.js, router.js and app.js
 */

// Initialize express app
const express = require('express')
const app = express()

// Initialize database using Sequelize
const db = require('./models').sequelize
const dbLocal = require('./localModels').sequelize
module.exports = {
  app,
  db,
  dbLocal
}
