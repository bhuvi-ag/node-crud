const Sequelize = require('sequelize');

const sequelize = new Sequelize('node-complete','admin','admin@123',{
    dialect:'mysql',
    host:'localhost'
})

module.exports = sequelize;