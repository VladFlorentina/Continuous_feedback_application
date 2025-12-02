# aplicatie pentru feedback continuu (backend restful)

proiect tehnologii web, ase 2025-2026.

hei! aici gasesti tot ce am implementat in faza a 2 a  a proiectului.

## 1. status proiect si livrabil (backend pe jumatate comeplet)

acest livrabil acopera integral etapele de setup, orm si autentificare.

###  infrastructura si securitate (sunt ok , trebuie sa mai fac mici modificari sau colega mea o sa mai faca modificari daca crede ca sunt necesare )

* **server:** node.js cu express.
* **baza de date:** postgresql (bd relationala).
* **orm:** sequelize. am definit cele 4 modele principale (`users`, `activities`, `feedback`, `courses`) si relatiile dintre ele.
* **securitate:** am implementat `bcrypt` pentru hash-uirea parolelor si `jsonwebtoken` pentru generarea de token-uri jwt.
* **api autentificare:** rutele `/register` si `/login` sunt functionale si returneaza un token jwt valid.
* **protectie:** am adaugat middleware-ul jwt care protejeaza rutele private.

###  obiective ramase (aici este partea colegei mele si desigur o sa intervin si eu daca o sa fie nevoie)

pentru finalizarea partii a 2 a pana la data  de 06.12.2025 (serviciu restful functional), trebuie sa implementam  logica de business principala:

* **pasul 4: rute profesor (rute protejate)**
    * `get /api/activities` (preluare lista activitati).
    * `get /api/activities/:id` (preluare feedback asociat).
* **pasul 5: logica studentului (rute publice)**
    * `post /api/join` (verificare cod acces si stare activa).
    * `post /api/feedback` (trimitere reactie anonima in bd).
* **pasul 6: curatenie**
    * revizuirea calitatii codului: organizare, `camelcase` si comentarii la logica de business.

---

## 2. instructiuni de rulare

aceste instructiuni descriu cum se instaleaza si se porneste serviciul restful.

### a. setup initial

1.  **prerechizite:** ai nevoie de node.js (v18+) si postgresql (cu pgadmin) instalate si pornite.
2.  **clonare repository:** `git clone ...`
3.  **creare bd:** creeaza o baza de date in pgadmin numita `feedback_app`.

### b. pornirea serverului

1.  **instalare dependente:** naviga in directorul `backend` si ruleaza:
    ```bash
    npm install
    ```
2.  **variabile de mediu (.env):** creeaza fisierul `.env` in **radacina proiectului** si completeaza-l cu credentiaalele tale locale.

    ```ini
    db_dialect=postgres
    db_host=localhost
    db_user=nume_utilizator_bd
    db_pass=parola_ta_de_postgresql
    db_name=web_feedback_db
    port=3000
    jwt_secret=cheiesecratafeedbacktw
    ```
3.  **start:** serverul va porni, se va conecta la bd si va crea tabelele automat via orm.
    ```bash
    npm start
    ```

### c. testarea functionalitatii (dovada de lucru)

foloseste thunder client (sau postman) pentru a verifica implementarea:

1.  **inregistrare profesor:**
    * metoda: `post`
    * url: `http://localhost:3000/api/auth/register`
    * body (json): `{"email": "profesor@ase.ro", "password": "parola"}`
2.  **obtine token:** la succes, salveaza tokenul jwt primit in raspuns.
3.  **test ruta protejata:**
    * metoda: `post`
    * url: `http://localhost:3000/api/activities`
    * header: adauga cheia **`x-auth-token`** cu token-ul obtinut la pasul anterior.
    * *rezultat asteptat:* status **201 created** si un `accesscode` in raspuns.