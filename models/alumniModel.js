const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/conn');

const Alumni = sequelize.define('Alumni', {
  alumniId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  studentNumber: {
    type: DataTypes.STRING(50), 
    allowNull: false,
    unique: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  experiencePoints: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  level: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  currentProfession: {
    type: DataTypes.STRING,
    allowNull: true
  },
  skills: {
    type: DataTypes.STRING,
    allowNull: true
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
}, {
  timestamps: false,
  tableName: 'Alumni'
});

module.exports = Alumni;
