const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/conn');

const AlumniCompany = sequelize.define('AlumniCompany', {
  alumniCompanyId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  alumniId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Alumni',
      key: 'alumniId'
    },
    allowNull: false
  },
  companyId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Company',
      key: 'companyId'
    },
    allowNull: false
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  timestamps: false,
  tableName: 'AlumniCompany'
});

module.exports = AlumniCompany;
