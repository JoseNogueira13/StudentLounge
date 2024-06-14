const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/conn');

const Projects = sequelize.define('Projects', {
  projectId: {
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
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  url: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  timestamps: false,
  tableName: 'Projects'
});

module.exports = Projects;
