# aplicatie pentru feedback continuu (backend restful)

proiect tehnologii web, ase 2025-2026.

hei! aici gasesti documentatia pentru servicul backend. aplicatia este acum completa si pregatita pentru deployment.

## 1. functionalitati implementate

am acoperit toate cerintele proiectului, inclusiv cele suplimentare:

### a. arhitectura si baza de date
* **server**: node.js cu express si socket.io pentru comunicare in timp real.
* **baza de date**: postgresql (configurata pentru supabase, dar merge si local).
* **orm**: sequelize pentru gestionarea modelelor (users, activities, feedback, courses).

### b. functionalitati cheie
* **autentificare si autorizare**: 
    * jwt pentru protectia rutelor.
    * roluri distincte: student, profesor, admin.
* **profesor**:
    * creeaza activitati si primeste automat un **cod qr** (generat extern).
    * vede feedback-ul studentilor in timp real.
* **student**:
    * se alatura activitatii folosind un cod numeric.
    * trimite feedback anonim (emoticoane) care apare instant pe dashboard-ul profesorului.
* **admin**:
    * panou special pentru gestionarea utilizatorilor.
    * statistici globale despre aplicatie.
* **serviciu extern**: integrare cu api-ul `qrserver.com` pentru generarea codurilor qr.

---

## 2. instructiuni de instalare

### pasul 1: instalare dependinte
intra in folderul `backend` si ruleaza:
```bash
npm install
```

### pasul 2: configurare mediu (.env)
creeaza un fisier `.env` in folderul `backend` cu urmatoarele variabile:

```env
PORT=3000
DB_HOST=chestia_ta_de_la_supabase.supabase.co
DB_USER=postgres
DB_PASS=parola_ta
DB_NAME=postgres
DB_DIALECT=postgres
JWT_SECRET=cheiesecrata
```
*nota*: daca folosesti supabase, asigura-te ca ai ssl activat (configuratia din `database.js` se ocupa de asta).

### pasul 3: populare baza de date
cand pornesti serverul, tabelele se creeaza automat (`sequelize.sync`).
pentru a crea un admin initial, poti rula scriptul utilitar:
```bash
node create_admin.js
```

### pasul 4: pornire server
```bash
npm start
```
serverul va porni pe portul 3000.

---

## 3. rute api disponibile

### autentificare
* `POST /api/auth/register` - inregistrare profesor.
* `POST /api/auth/login` - login (returneaza token si rol).

### activitati (profesor)
* `POST /api/activities` - creeaza activitate (genereaza cod qr).
* `GET /api/activities` - lista activitatilor mele.
* `GET /api/activities/:id` - detalii + feedback primit.

### student (public)
* `POST /api/join` - alaturare la activitate (valideaza cod acces).
* `POST /api/feedback` - trimite feedback (emite eveniment socket.io).

### admin (protejat)
* `GET /api/admin/stats` - statistici aplicatie.
* `GET /api/admin/users` - lista utilizatori.
* `PUT /api/admin/users/:id` - editare utilizator.
* `DELETE /api/admin/users/:id` - stergere utilizator.