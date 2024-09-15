const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server.js'); // bez rozszerzenia .js
const { User, Event, Place } = require('../models');

const { expect } = chai;

chai.use(chaiHttp);


describe('API Routes', () => {
  let token; // Przechowuje token uwierzytelniający

  // Przed każdym testem
  before(async () => {
    // Usuń wszystkie dane przed rozpoczęciem testów
    await User.destroy({ where: {}, truncate: true });
    await Event.destroy({ where: {}, truncate: true });
    await Place.destroy({ where: {}, truncate: true });

    // Rejestracja testowego użytkownika
    const res = await chai
      .request(server)
      .post('/auth/register')
      .send({ email: 'test@example.com', haslo: 'test123', grupa_wiekowa: 'YOUNG' });

    token = res.body.token; // Ustaw token
  });

  describe('POST /auth/register', () => {
    it('powinno zarejestrować użytkownika', async () => {
      const res = await chai.request(server)
        .post('/auth/register')
        .send({ email: 'user@example.com', haslo: 'password123', grupa_wiekowa: 'YOUNG' });

      expect(res).to.have.status(200);
      expect(res.body).to.have.property('token');
    });

    it('powinno zwrócić błąd przy braku danych', async () => {
      const res = await chai.request(server)
        .post('/auth/register')
        .send({ email: '', haslo: '', grupa_wiekowa: '' });

      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error');
    });
  });

  describe('POST /auth/login', () => {
    it('powinno zalogować użytkownika i zwrócić token', async () => {
      const res = await chai.request(server)
        .post('/auth/login')
        .send({ email: 'test@example.com', haslo: 'test123' });

      expect(res).to.have.status(200);
      expect(res.body).to.have.property('token');
    });

    it('powinno zwrócić błąd przy niepoprawnych danych', async () => {
      const res = await chai.request(server)
        .post('/auth/login')
        .send({ email: 'wrong@example.com', haslo: 'wrongpass' });

      expect(res).to.have.status(401);
      expect(res.body).to.have.property('error');
    });
  });

  describe('GET /events/:event_id', () => {
    let eventId;
    before(async () => {
      // Tworzenie testowego wydarzenia
      const event = await Event.create({
        id_autora: 1,
        id_miejsca: 1,
        max_liczba_uczestnikow: 10,
        data_rozpoczecia: new Date(),
        czas_trwania: 60,
        grupa_wiekowa: 'YOUNG',
        dyscyplina: 'FOOTBALL'
      });
      eventId = event.id;
    });

    it('powinno zwrócić wydarzenie po ID', async () => {
      const res = await chai.request(server)
        .get(`/events/${eventId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res).to.have.status(200);
      expect(res.body).to.have.property('id');
    });

    it('powinno zwrócić błąd przy nieprawidłowym UUID', async () => {
      const res = await chai.request(server)
        .get('/events/invalid-uuid')
        .set('Authorization', `Bearer ${token}`);

      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error', 'Nieprawidłowy format UUID');
    });
  });

  describe('GET /places/available', () => {
    it('powinno zwrócić dostępne miejsca', async () => {
      const res = await chai.request(server)
        .get('/places/available')
        .query({ dyscyplina: 'FOOTBALL', godzina: '2024-09-12T10:00:00.000Z', czas_trwania: '60' });

      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array');
    });

    it('powinno zwrócić błąd przy braku parametrów', async () => {
      const res = await chai.request(server)
        .get('/places/available')
        .query({});

      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error', 'Brak wymaganych parametrów.');
    });
  });
});
