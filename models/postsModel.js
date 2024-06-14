const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/conn');

const Posts = sequelize.define('Posts', {
  postId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true
  },
  postBody: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  timestamps: false,
  tableName: 'Posts'
});

module.exports = Posts;
