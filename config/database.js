// config/database.js
const { Sequelize } = require('sequelize');

// Upewnij się, że te parametry są poprawne
const sequelize = new Sequelize('moja_baza_danych', 'uzytkownik', 'haslo', {
  host: 'localhost', // lub inny adres, jeśli baza danych jest na innym serwerze
  port: 5432, // domyślny port PostgreSQL
  dialect: 'postgres',
  logging: false, // Wyłącz logowanie, aby zredukować wyjścia w konsoli
});

module.exports = sequelize;
