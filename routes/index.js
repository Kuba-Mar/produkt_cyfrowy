// routes/index.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Sequelize, Op } = require('sequelize'); 
const { User, Event, Place } = require('../models');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();
const JWT_SECRET = 'your_jwt_secret_key';

// Funkcja pomocnicza do sprawdzenia poprawności UUID
function isValidUUID(uuid) {
  return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/.test(uuid);
}

const { validate: isUuid } = require('uuid');

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

    const eventId = req.params.event_id.trim();

    if (!/^[0-9a-fA-F-]{36}$/.test(eventId)) {
      return res.status(400).json({ error: 'Nieprawidłowy format UUID' });
    }

    // Znajdź wydarzenie po ID
    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({ error: 'Wydarzenie nie znalezione' });
    }

    res.json(event);
  } catch (error) {
    console.error('Błąd pobierania wydarzenia:', error);
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
    const eventId = req.params.event_id;
    const userId = req.user.id; // Użytkownik jest uwierzytelniony, więc powinien mieć swoje ID w żądaniu

    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({ error: 'Wydarzenie nie znalezione' });
    }

    // Czy użytkownik jest już uczestnikiem wydarzenia
    const isUserAlreadyParticipant = await event.hasUser(userId);
    if (isUserAlreadyParticipant) {
      return res.status(400).json({ error: 'Użytkownik już dołączył do wydarzenia' });
    }

    await event.addUser(userId);

    res.sendStatus(200);
  } catch (error) {
    console.error('Błąd podczas dołączania do wydarzenia:', error);
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
// Endpoint do pobierania dostępnych miejsc dla danej godziny, długości i dyscypliny
// router.get('/places/available', async (req, res) => {
//   const { dyscyplina, godzina, czas_trwania } = req.query;

//   try {
//     // Sprawdzenie poprawności parametrów wejściowych
//     if (!dyscyplina || !godzina || !czas_trwania) {
//       return res.status(400).json({ error: 'Brak wymaganych parametrów.' });
//     }

//     // Konwersja godziny na format Date
//     const startTime = new Date(godzina);

//     // Sprawdzenie poprawności daty
//     if (isNaN(startTime.getTime())) {
//       return res.status(400).json({ error: 'Nieprawidłowy format godziny.' });
//     }

//     // Obliczenie końca wydarzenia
//     const endTime = new Date(startTime);
//     endTime.setMinutes(endTime.getMinutes() + parseInt(czas_trwania, 10));

//     // Pobranie miejsc zgodnych z parametrami
//     const places = await Place.findAll({
//       where: {
//         dyscyplina
//       }
//     });

//     const availablePlaces = [];

//     for (const place of places) {
//       // Debugowanie UUID miejsca
//       console.log('Sprawdzanie miejsca o ID:', place.id);

//       // Sprawdzenie, czy UUID jest prawidłowy
//       if (!isUuid(place.id)) {
//         console.error('Nieprawidłowy UUID miejsca:', place.id);
//         continue; // Pomijamy miejsca z niepoprawnym UUID
//       }

//       // Pobranie wydarzeń kolidujących z danym miejscem
//       const conflictingEvents = await Event.findOne({
//         where: {
//           id_miejsca: place.id,
//           [Op.or]: [
//             {
//               data_rozpoczecia: {
//                 [Op.between]: [startTime, endTime],
//               },
//             },
//             {
//               data_rozpoczecia: {
//                 [Op.lt]: startTime,
//               },
//               [Op.and]: Sequelize.where(
//                 Sequelize.literal(
//                   `EXTRACT(EPOCH FROM (timestamp '${startTime.toISOString()}' - data_rozpoczecia)) / 60`
//                 ),
//                 {
//                   [Op.gt]: Sequelize.col('czas_trwania'),
//                 }
//               ),
//             },
//           ],
//         },
//       });

//       // Dodanie miejsca do listy, jeśli brak konfliktu
//       if (!conflictingEvents) {
//         availablePlaces.push(place);
//       }
//     }

//     res.json(availablePlaces);

//   } catch (error) {
//     console.error('Błąd pobierania dostępnych miejsc:', error);
//     res.status(500).json({ error: 'Błąd pobierania dostępnych miejsc' });
//   }
// });
router.get('/places/available', async (req, res) => {
  const { dyscyplina, godzina, czas_trwania } = req.query;

  try {
    console.log('Otrzymane zapytanie:', req.query); 

    // Sprawdzenie poprawności parametrów wejściowych
    if (!dyscyplina || !godzina || !czas_trwania) {
      return res.status(400).json({ error: 'Brak wymaganych parametrów.' }); 
    }

    // Konwersja godziny na format Date
    const startTime = new Date(godzina);
    console.log('Początkowy czas:', startTime);

    // Sprawdzenie poprawności daty
    if (isNaN(startTime.getTime())) {
      console.log('Nieprawidłowy format godziny:', godzina); 
      return res.status(400).json({ error: 'Nieprawidłowy format godziny.' });
    }

    // Obliczenie końca wydarzenia
    const endTime = new Date(startTime);
    endTime.setMinutes(endTime.getMinutes() + parseInt(czas_trwania, 10));
    console.log('Koniec czasu:', endTime);

    // Pobranie miejsc zgodnych z parametrami
    const places = await Place.findAll({
      where: {
        dyscyplina
      }
    });
    console.log('Znalezione miejsca:', places.length);

    const availablePlaces = [];

    for (const place of places) {
      console.log('Sprawdzanie miejsca o ID:', place.id);

      const conflictingEvents = await Event.findOne({
        where: {
          id_miejsca: place.id,
          [Op.and]: [
            // Wydarzenie zaczyna się przed końcem wyszukiwanego okresu i kończy się po rozpoczęciu wyszukiwanego okresu
            {
              data_rozpoczecia: {
                [Op.lt]: endTime, // Wydarzenie zaczyna się przed końcem wyszukiwanego okresu
              },
            },
            Sequelize.where(
              Sequelize.literal(
                `data_rozpoczecia + (czas_trwania * INTERVAL '1 minute')`
              ),
              {
                [Op.gt]: startTime, // Wydarzenie kończy się po rozpoczęciu wyszukiwanego okresu
              }
            ),
          ],
        },
      });

      console.log(`Dla miejsca ${place.id} znaleziono konfliktujące wydarzenia:`, conflictingEvents);

      // Dodanie miejsca do listy, jeśli brak konfliktu
      if (!conflictingEvents) {
        console.log('Miejsce dodane do dostępnych:', place.id);
        availablePlaces.push(place);
      }
    }

    console.log('Dostępne miejsca:', availablePlaces);

    res.json(availablePlaces);

  } catch (error) {
    console.error('Błąd pobierania dostępnych miejsc:', error);
    res.status(500).json({ error: 'Błąd pobierania dostępnych miejsc' });
  }
});





router.get('/places/:place_id', async (req, res) => {
  try {
    const placeId = req.params.place_id;

    if (!/^[0-9a-fA-F-]{36}$/.test(placeId)) {
      return res.status(400).json({ error: 'Nieprawidłowy format UUID' });
    }

    // Miejsce po ID
    const place = await Place.findByPk(placeId);
    if (!place) {
      return res.status(404).json({ error: 'Miejsce nie znalezione' });
    }

    res.json(place);
  } catch (error) {
    console.error('Błąd pobierania miejsca:', error);
    res.status(500).json({ error: 'Błąd pobierania miejsca' });
  }
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
