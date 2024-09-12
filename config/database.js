// config/database.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

// Upewnij się, że te parametry są poprawne
// const sequelize = new Sequelize('moja_baza_danych', 'uzytkownik', 'haslo', {
//   host: 'localhost', // lub inny adres, jeśli baza danych jest na innym serwerze
//   port: 5432, // domyślny port PostgreSQL
//   dialect: 'postgres',
//   logging: false, // Wyłącz logowanie, aby zredukować wyjścia w konsoli
// });

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: 'postgres',
  logging: false,
});

sequelize.authenticate()
  .then(() => {
    console.log('Połączenie z bazą danych zostało nawiązane.');
  })
  .catch(err => {
    console.error('Błąd podczas łączenia z bazą danych:', err);
  });


module.exports = sequelize;
