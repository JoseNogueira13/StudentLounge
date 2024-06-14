const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/conn');

const Events = sequelize.define('Events', {
  eventId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  timestamps: false,
  tableName: 'Events'
});

module.exports = Events;
