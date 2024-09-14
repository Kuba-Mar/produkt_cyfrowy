// models/Event.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Place = require('./Place');

const Event = sequelize.define('Event', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  id_autora: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  id_miejsca: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  max_liczba_uczestnikow: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
    },
  },
  data_rozpoczecia: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  czas_trwania: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
    },
  },
  grupa_wiekowa: {
    type: DataTypes.ENUM('YOUNG', 'ADULT'),
    allowNull: false,
  },
  dyscyplina: {
    type: DataTypes.ENUM('FOOTBALL', 'BASKETBALL', 'TENNIS'),
    allowNull: false,
  }
}, {
  timestamps: true // Wyłączenie timestamps
});

// Relacje
Event.belongsToMany(User, { through: 'EventParticipants', foreignKey: 'event_id' });
User.belongsToMany(Event, { through: 'EventParticipants', foreignKey: 'user_id' });

module.exports = Event;
