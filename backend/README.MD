# aplicatie pentru feedback continuu (backend restful)

proiect tehnologii web, ase 2025-2026.

hei! aici gasesti tot ce am implementat la backend. proiectul este acum complet functional pentru faza 2.

## 1. status proiect: functional

am terminat implementarea si am acoperit toate cerintele: setup, orm, autentificare, plus logica pentru profesori si studenti.

### a. infrastructura si securitate (partea initiala)
* server: node.js cu express.
* baza de date: postgresql.
* orm: sequelize (avem modelele users, activities, feedback, courses).
* securitate: bcrypt pentru parole si jsonwebtoken (jwt) pentru login.
* protectie: middleware care verifica token-ul pe rutele private.

### b. functionalitati noi implementate (partea finala)
am adaugat logica de business care lipsea data trecuta:
* profesorii pot crea activitati noi (cu conditia sa existe un curs).
* profesorii isi pot vedea lista de activitati si feedback-ul primit.
* studentii se pot alatura cu un cod de acces.
* studentii pot trimite feedback anonim (smiley, frowny etc).

---

## 2. instructiuni de instalare si rulare

urmeaza pasii astia ca sa pornesti serverul la tine local.

### pasul 1: prerechizite
trebuie sa ai node.js si postgresql (pgadmin) instalate.

### pasul 2: instalare
intra in folderul "backend" si scrie in terminal:
npm install

### pasul 3: configurare baza de date
1. intra in pgadmin si creeaza o baza de date goala numita "web_feedback_db".
2. in folderul "backend", creeaza un fisier nou numit ".env" si pune codul de mai jos (schimba parola cu a ta):

DB_DIALECT=postgres
DB_HOST=localhost
DB_USER=postgres
DB_PASS=parola_ta_aici
DB_NAME=web_feedback_db
PORT=3000
JWT_SECRET=cheiesecratafeedbacktw

### pasul 4: pornire
tot in folderul backend, scrie comanda:
npm start

daca apare "conexiune bd stabilita", inseamna ca serverul merge. tabelele se creeaza automat.

---

## 3. nota importanta (citeste aici daca nu merge crearea activitatii)

ca sa poti testa ruta de creare activitate (POST /api/activities), ai nevoie de un curs in baza de date, pentru ca activitatea este legata de un curs (foreign key).

momentan nu avem interfata sa cream cursuri, asa ca trebuie sa inserezi unul manual.
deschide pgadmin -> query tool pe baza ta si ruleaza asta:

INSERT INTO "Courses" (name, "userId", "createdAt", "updatedAt") 
VALUES ('Tehnologii Web', 1, NOW(), NOW());

(nota: comanda asta merge doar dupa ce ti-ai facut un cont de profesor si ai id-ul 1 in tabela users).

---

## 4. testarea functionalitatii (dovada de lucru)

foloseste thunder client (sau postman) pentru a verifica implementarea, exact cum se cerea in ghid:

1. *inregistrare profesor:*
   * metoda: POST
   * url: http://localhost:3000/api/auth/register
   * body (json): {"email": "profesor@ase.ro", "password": "parola"}

2. *obtine token:* * la succes, primesti un token lung in raspuns. copiaza-l!

3. *test ruta protejata (creare activitate):*
   * metoda: POST
   * url: http://localhost:3000/api/activities
   * header: adauga cheia x-auth-token si pune valoarea token-ului copiat anterior.
   * body (json): {"courseId": 1, "description": "Curs Test", "startDate": "2025-12-06T10:00:00Z", "durationMinutes": 60}
   * rezultat asteptat: status 201 created si un accessCode in raspuns.

4. *test student (fara token):*
   * metoda: POST
   * url: http://localhost:3000/api/join
   * body (json): {"access_code": "CODUL_PRIMIT_MAI_SUS"}