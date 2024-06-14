const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/conn');

const FavoritePosts = sequelize.define('FavoritePosts', {
  favoritePostId: {
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
  postId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Posts',
      key: 'postId'
    },
    allowNull: false
  }
}, {
  timestamps: false,
  tableName: 'FavoritePosts'
});

module.exports = FavoritePosts;
