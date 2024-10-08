// config/database.js
const { Sequelize } = require('sequelize');
require('dotenv').config(); 

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: 'postgres',
  logging: false, 
  dialectOptions: {
    ssl: false, 
  },
});

// Testowanie połączenia
sequelize.authenticate()
  .then(() => {
    console.log('Połączenie z lokalną bazą danych zostało nawiązane.');
  })
  .catch(err => {
    console.error('Błąd podczas łączenia z lokalną bazą danych:', err);
  });

module.exports = sequelize;

