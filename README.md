# Aplicatie de Feedback Continuu

Aceasta aplicatie web permite profesorilor sa ceara feedback in timp real de la studenti in timpul cursurilor sau seminariilor.

## Functionalitati

### Pentru Profesori:
* **Creare Cont:** Profesorii isi pot crea un cont securizat.
* **Creare Activitate:** Pot defini activitati cu descriere si durata.
* **Cod QR:** La crearea unei activitati, se genereaza automat un cod QR si un cod de acces unic.
* **Monitorizare Feedback:** Profesorii vad in timp real (prin Socket.io) reactiile studentilor (Smiley, Frowny, Surprised, Confused).
* **Istoric:** Pot vizualiza activitatile trecute.

### Pentru Studenti:
* **Acces Simplu:** Nu necesita cont. Se intra doar cu codul numeric primit de la profesor.
* **Interfata Intuitiva:** 4 butoane mari de reactie.
* **Anonimitate:** Feedback-ul este anonim.

## Tehnologii Utilizate

* **Frontend:** React.js, Material UI, Vite
* **Backend:** Node.js, Express.js
* **Baza de Date:** PostgreSQL, Sequelize ORM
* **Real-time:** Socket.io
* **API Extern:** API QRServer pentru generarea codurilor QR

## Instructiuni de Rulare

### 1. Backend
Navigheaza in folderul `backend`:
```bash
cd backend
npm install
# Configureaza fisierul .env conform exemplului (daca exista) sau asigura-te ca ai o baza de date PostgreSQL activa
npm start
```
Serverul va porni pe portul 3000.

### 2. Frontend
Navigheaza in folderul `frontend`:
```bash
cd frontend
npm install
npm run dev
```
Aplicatia va fi disponibila la adresa afisata in terminal (de obicei http://localhost:5173).

## Structura Proiectului

* `/backend` - Codul sursa al serverului (API, modele DB, logica business).
* `/frontend` - Interfata utilizator React, pagini si componente.

## Mentenanta si Dezvoltare

Codul este comentat si structurat modular. Pentru modificari:
* Adaugare rute noi: Vezi `backend/routes`.
* Modificare UI: Vezi `frontend/src/pages` si `components`.