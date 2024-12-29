const Sequelize = require('sequelize');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database_assignment.sqlite',
});

module.exports = { DataTypes: Sequelize.DataTypes, sequelize };
