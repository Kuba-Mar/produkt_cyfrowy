// models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  haslo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  grupa_wiekowa: {
    type: DataTypes.ENUM('YOUNG', 'ADULT'),
    allowNull: false,
  }
}, {
  timestamps: false, // timestamp wyłączony 
});

module.exports = User;
