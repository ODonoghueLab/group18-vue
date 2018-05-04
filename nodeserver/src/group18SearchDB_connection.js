
const models = require('./models')

const init = async function () {
  await models.sequelize.sync()
}

init()
