// routes/index.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Event, Place } = require('../models');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();
const JWT_SECRET = 'your_jwt_secret_key';

// --- Auth Endpoints ---
router.post('/auth/register', async (req, res) => {
  try {
    const { email, haslo, grupa_wiekowa } = req.body;

    if (!email || !haslo || !grupa_wiekowa) {
      return res.status(400).json({ error: 'Wszystkie pola są wymagane.' });
    }

    // czy użytkownik już istnieje
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Użytkownik o tym adresie email już istnieje.' });
    }

    // Haszowanie hasła
    const hashedPassword = await bcrypt.hash(haslo, 10);

    // Tworzenie nowego użytkownika
    const newUser = await User.create({ email, haslo: hashedPassword, grupa_wiekowa });

    // Generowanie tokenu JWT
    const token = jwt.sign({ id: newUser.id }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    console.error('Błąd rejestracji:', error); // Logowanie błędu do konsoli
    res.status(500).json({ error: 'Rejestracja nie powiodła się' });
  }
});


router.post('/auth/login', async (req, res) => {
  try {
    const { email, haslo } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user || !await bcrypt.compare(haslo, user.haslo)) {
      return res.status(401).json({ error: 'Błędne dane logowania' });
    }
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Logowanie nie powiodło się' });
  }
});

router.post('/auth/refresh', (req, res) => {
  const { token } = req.body;
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token nieaktualny' });
    const newToken = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token: newToken });
  });
});

// --- Events Endpoints ---
router.get('/events/:event_id', authenticateToken, async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.event_id);
    if (!event) return res.status(404).json({ error: 'Wydarzenie nie znalezione' });
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: 'Błąd pobierania wydarzenia' });
  }
});

// router.post('/events/create', authenticateToken, async (req, res) => {
//   try {
//     const { id_autora, id_miejsca, max_liczba_uczestnikow, data_rozpoczecia, czas_trwania, grupa_wiekowa, dyscyplina } = req.body;
//     const newEvent = await Event.create({ id_autora, id_miejsca, max_liczba_uczestnikow, data_rozpoczecia, czas_trwania, grupa_wiekowa, dyscyplina });
//     res.status(201).json(newEvent);
//   } catch (error) {
//     res.status(500).json({ error: 'Tworzenie wydarzenia nie powiodło się' });
//   }
// });

router.post('/events/create', authenticateToken, async (req, res) => {
  try {
    const { id_miejsca, max_liczba_uczestnikow, data_rozpoczecia, czas_trwania, grupa_wiekowa, dyscyplina } = req.body;

    // Walidacja danych wejściowych
    if (!id_miejsca || !max_liczba_uczestnikow || !data_rozpoczecia || !czas_trwania || !grupa_wiekowa || !dyscyplina) {
      return res.status(400).json({ error: 'Wszystkie pola są wymagane.' });
    }

    // Tworzenie nowego wydarzenia
    const newEvent = await Event.create({
      id_autora: req.user.id, // Z użyciem id użytkownika zalogowanego
      id_miejsca,
      max_liczba_uczestnikow,
      data_rozpoczecia,
      czas_trwania,
      grupa_wiekowa,
      dyscyplina
    });

    res.status(201).json(newEvent);
  } catch (error) {
    console.error('Błąd tworzenia wydarzenia:', error); // Wyświetl szczegóły błędu
    res.status(500).json({ error: 'Tworzenie wydarzenia nie powiodło się' });
  }
});

router.post('/events/join/:event_id', authenticateToken, async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.event_id);
    if (!event) return res.status(404).json({ error: 'Wydarzenie nie znalezione' });
    await event.addUser(req.user.id);
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ error: 'Błąd podczas dołączania do wydarzenia' });
  }
});

router.post('/events/leave/:event_id', authenticateToken, async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.event_id);
    if (!event) return res.status(404).json({ error: 'Wydarzenie nie znalezione' });
    await event.removeUser(req.user.id);
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ error: 'Błąd podczas opuszczania wydarzenia' });
  }
});

// --- Places Endpoints ---
router.get('/places/:place_id', async (req, res) => {
  try {
    const place = await Place.findByPk(req.params.place_id);
    if (!place) return res.status(404).json({ error: 'Miejsce nie znalezione' });
    res.json(place);
  } catch (error) {
    res.status(500).json({ error: 'Błąd pobierania miejsca' });
  }
});

router.get('/places/available', async (req, res) => {
  const { dyscyplina, godzina, czas_trwania } = req.query;
  // TO DO miejsca dostępne 
  res.json([]);
});

// --- User Endpoints ---
router.get('/users/:user_id/created_events', authenticateToken, async (req, res) => {
  try {
    const events = await Event.findAll({ where: { id_autora: req.params.user_id } });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Błąd pobierania wydarzeń' });
  }
});

router.get('/users/:user_id/joined_events', authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.user_id);
    const events = await user.getEvents();
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Błąd pobierania wydarzeń' });
  }
});

module.exports = router;
