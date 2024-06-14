const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/conn');

const Chat = sequelize.define('Chat', {
  chatId: {
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
  recipientId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  timestamps: false,
  tableName: 'Chat'
});

module.exports = Chat;
