const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/conn');

const AlumniEvents = sequelize.define('AlumniEvents', {
  alumniEventId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  alumniId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Alumni',
      key: 'alumniId',
      onDelete: 'CASCADE'
    },
    allowNull: false
  },
  eventId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Events',
      key: 'eventId'
    },
    allowNull: false
  }
}, {
  timestamps: false,
  tableName: 'AlumniEvents'
});

module.exports = AlumniEvents;
