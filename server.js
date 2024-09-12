// server.js
const express = require('express');
const sequelize = require('./config/database');
const routes = require('./routes/index');

const app = express();

app.use(express.json());
app.use(routes);

// Synchronizacja z bazą danych
sequelize.sync({ force: false }) // Ustawienie force: false zapobiega nadpisywaniu istniejących danych
  .then(() => {
    console.log('Baza danych zsynchronizowana');
    app.listen(3000, () => {
      console.log('Serwer działa na http://localhost:3000');
    });
  })
  .catch(err => console.error('Błąd synchronizacji z bazą danych:', err));

