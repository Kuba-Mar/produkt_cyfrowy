// models/Place.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Place = sequelize.define('Place', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  dyscyplina: {
    type: DataTypes.ENUM('FOOTBALL', 'BASKETBALL', 'TENNIS'),
    allowNull: false,
  },
  nazwa: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lat: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  lng: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  adres: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {});

module.exports = Place;
