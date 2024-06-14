// config/database.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('teste', 'root', 'Silgueira133.', {
  host: 'localhost',
  dialect: 'mysql',
});

try {
  sequelize.authenticate()
  console.log('Database connected successfully');
} catch (error) {
  console.log(`Database could not connect with error ${error}`);
}

module.exports = { Sequelize, sequelize };