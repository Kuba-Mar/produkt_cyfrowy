// server.js
const express = require('express');
const cors = require('cors'); // Import CORS
const sequelize = require('./config/database');
const routes = require('./routes/index');

const app = express();

// Użycie middleware CORS
app.use(cors({
  origin: 'http://localhost:3000', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  credentials: false 
}));

// Middleware do obsługi JSON
app.use(express.json());
app.use(routes);

// Synchronizacja z bazą danych
sequelize.sync({ force: false }) 
  .then(() => {
    console.log('Baza danych zsynchronizowana');
    app.listen(3000, () => {
      console.log('Serwer działa na http://localhost:3000');
    });
  })
  .catch(err => console.error('Błąd synchronizacji z bazą danych:', err));

