const Sequelize = require('sequelize')
const sequelize = new Sequelize('facialreco', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql',
})

module.exports = sequelize