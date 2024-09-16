# produkt_cyfrowy
Projekt na zaliczenie 

# Instalacja postgresql 
~~~sh
brew install postgresql
brew services start postgresql
psql postgres
~~~
# Tworzenie bazy danych
~~~sh
createdb moja_baza_danych
psql moja_baza_danych
psql -U postgres -d moja_baza_danych -f backup.sql
~~~
# Sprawdź plik .env, zmień na swoje wartości 
# Instalacja zaleznosci node 
~~~sh
npm install
~~~
# Uruchomienie aplikacji 
~~~sh
npm start
~~~

## Auth Endpoints

### Rejestracja użytkownika

**POST /auth/register**

Rejestruje nowego użytkownika.

- **Body**:
  - `email` (string): Email użytkownika
  - `haslo` (string): Hasło użytkownika
  - `grupa_wiekowa` (string): Grupa wiekowa użytkownika (np. 'YOUNG', 'ADULT')

- **Odpowiedzi**:
  - 200: Zwraca token JWT
  - 400: Brak wymaganych pól lub użytkownik już istnieje
  - 500: Błąd rejestracji

### Logowanie użytkownika

**POST /auth/login**

Loguje użytkownika i zwraca token JWT.

- **Body**:
  - `email` (string): Email użytkownika
  - `haslo` (string): Hasło użytkownika

- **Odpowiedzi**:
  - 200: Zwraca token JWT
  - 401: Błędne dane logowania
  - 500: Błąd logowania

### Odświeżenie tokenu

**POST /auth/refresh**

Odświeża token JWT.

- **Body**:
  - `token` (string): Token JWT do odświeżenia

- **Odpowiedzi**:
  - 200: Zwraca nowy token JWT
  - 403: Token nieaktualny

## Events Endpoints

### Pobranie wydarzenia po ID

**GET /events/:event_id**

Zwraca szczegóły wydarzenia na podstawie ID.

- **Parametry URL**:
  - `event_id` (UUID): ID wydarzenia

- **Nagłówki**:
  - `Authorization`: Token JWT

- **Odpowiedzi**:
  - 200: Zwraca szczegóły wydarzenia
  - 400: Nieprawidłowy format UUID
  - 404: Wydarzenie nie znalezione
  - 500: Błąd pobierania wydarzenia

### Tworzenie nowego wydarzenia

**POST /events/create**

Tworzy nowe wydarzenie.

- **Body**:
  - `id_miejsca` (UUID): ID miejsca
  - `max_liczba_uczestnikow` (integer): Maksymalna liczba uczestników
  - `data_rozpoczecia` (date): Data rozpoczęcia
  - `czas_trwania` (integer): Czas trwania w minutach
  - `grupa_wiekowa` (string): Grupa wiekowa
  - `dyscyplina` (string): Dyscyplina

- **Nagłówki**:
  - `Authorization`: Token JWT

- **Odpowiedzi**:
  - 201: Wydarzenie zostało stworzone
  - 400: Brak wymaganych pól
  - 500: Błąd tworzenia wydarzenia

### Dołączenie do wydarzenia

**POST /events/join/:event_id**

Dołącza użytkownika do wydarzenia.

- **Parametry URL**:
  - `event_id` (UUID): ID wydarzenia

- **Nagłówki**:
  - `Authorization`: Token JWT

- **Odpowiedzi**:
  - 200: Dołączenie do wydarzenia powiodło się
  - 400: Użytkownik już dołączył do wydarzenia
  - 404: Wydarzenie nie znalezione
  - 500: Błąd podczas dołączania do wydarzenia

### Opuszczenie wydarzenia

**POST /events/leave/:event_id**

Usuwa użytkownika z wydarzenia.

- **Parametry URL**:
  - `event_id` (UUID): ID wydarzenia

- **Nagłówki**:
  - `Authorization`: Token JWT

- **Odpowiedzi**:
  - 200: Opuszczenie wydarzenia powiodło się
  - 404: Wydarzenie nie znalezione
  - 500: Błąd podczas opuszczania wydarzenia

## Places Endpoints

### Pobranie miejsca po ID

**GET /places/:place_id**

Zwraca szczegóły miejsca na podstawie ID.

- **Parametry URL**:
  - `place_id` (UUID): ID miejsca

- **Odpowiedzi**:
  - 200: Zwraca szczegóły miejsca
  - 400: Nieprawidłowy format UUID
  - 404: Miejsce nie znalezione
  - 500: Błąd pobierania miejsca

### Pobranie dostępnych miejsc

**GET /places/available**

Zwraca listę dostępnych miejsc na podstawie godziny, długości i dyscypliny.

- **Query Parameters**:
  - `dyscyplina` (string): Dyscyplina
  - `godzina` (string): Godzina w formacie ISO (np. "2024-09-12T10:00:00.000Z")
  - `czas_trwania` (integer): Czas trwania w minutach

- **Odpowiedzi**:
  - 200: Zwraca listę dostępnych miejsc
  - 400: Brak wymaganych parametrów lub nieprawidłowy format godziny
  - 500: Błąd pobierania dostępnych miejsc

## User Endpoints

### Pobranie wydarzeń stworzonych przez użytkownika

**GET /users/:user_id/created_events**

Zwraca listę wydarzeń stworzonych przez użytkownika.

- **Parametry URL**:
  - `user_id` (UUID): ID użytkownika

- **Nagłówki**:
  - `Authorization`: Token JWT

- **Odpowiedzi**:
  - 200: Zwraca listę wydarzeń
  - 500: Błąd pobierania wydarzeń

### Pobranie wydarzeń, do których użytkownik dołączył

**GET /users/:user_id/joined_events**

Zwraca listę wydarzeń, do których użytkownik dołączył.

- **Parametry URL**:
  - `user_id` (UUID): ID użytkownika

- **Nagłówki**:
  - `Authorization`: Token JWT

- **Odpowiedzi**:
  - 200: Zwraca listę wydarzeń
  - 500: Błąd pobierania wydarzeń