const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/conn');

const Message = sequelize.define('Message', {
  messageId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  chatId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Chat',
      key: 'chatId',
      onDelete: 'CASCADE'
    },
    allowNull: false
  },
  messageBody: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  time: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  timestamps: false,
  tableName: 'Message'
});

module.exports = Message;
