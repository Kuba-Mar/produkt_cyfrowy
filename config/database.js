// config/database.js
const { Sequelize } = require('sequelize');
require('dotenv').config(); // Wczytaj zmienne środowiskowe z pliku .env

// Użycie URL połączenia z pliku .env
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  logging: false, // Wyłącz logowanie SQL
  dialectOptions: {
    ssl: {
      require: true, // Wymagane połączenie SSL
      rejectUnauthorized: false, // Wyłączenie sprawdzania certyfikatu SSL (może być wymagane w Railway)
    },
  },
});

// Testowanie połączenia
sequelize.authenticate()
  .then(() => {
    console.log('Połączenie z bazą danych zostało nawiązane.');
  })
  .catch(err => {
    console.error('Błąd podczas łączenia z bazą danych:', err);
  });

module.exports = sequelize;
