# Aplicatie pentru Feedback Continuu

Proiect pentru materia Tehnologii Web, ASE 2025-2026.

## 1. Despre (About)

O aplicatie web (Single Page Application) care permite profesorilor sa primeasca feedback continuu si anonim de la studenti in timpul unei activitati (curs sau seminar).

**Ideea:** Un profesor defineste o activitate si primeste un cod unic. Studentii folosesc acel cod pentru a intra intr-o interfata simpla de unde pot trimite reactii (emoticoane) oricand doresc. Profesorul vede un flux live al acestor reactii, asociate cu momentul la care au fost trimise.

## 2. Functionalitati (Features)

### Functionalitati de baza (Minime)

* **Rolul de Profesor:**
    * Poate defini o activitate noua la o anumita data, cu o descriere.
    * Sistemul genereaza un cod unic de acces pentru activitate.
    * Activitatea poate fi accesata pentru o durata prestabilita de timp.
    * Poate vedea feedback-ul continuu (anonim) cu momentele de timp asociate.
    * Feedback-ul este accesibil atat in timpul activitatii, cat si ulterior.
* **Rolul de Student:**
    * Poate introduce un cod pentru a participa la o activitate.
    * Are acces la o interfata cu 4 emoticoane (ex: smiley face, frowny face, surprised face, confused face).
    * Poate apasa pe un emoticon in orice moment pentru a reactiona.
    * Poate adauga oricate instante de feedback.

## 3. Stiva Tehnologica (Tech Stack)

Conform cerintelor generale ale proiectului:

* **Frontend:** **React.js** (sau Angular 2+, Vue.js).
* **Backend:** **Node.js** cu o interfata REST.
* **Database:** O baza de date relationala (ex: PostgreSQL, MySQL).
* **ORM:** Un ORM pentru accesul la baza de date (ex: Sequelize).
* **Deployment:** TBD (ex: Azure, AWS).
* **Versionare:** **Git**.

## 4. Structura Bazei de Date (Draft)

Planul initial pentru tabelele principale:

* **Utilizatori:** Stocheaza datele profesorilor (conturi, date de autentificare).
* **Cursuri:** O entitate care grupeaza activitatile (ex: Cursul "Tehnologii Web").
* **Activitati:** Sesiunile de feedback (cursul sau seminarul specific la o anumita data, cu codul de acces generat).
* **Feedback:** Stocheaza fiecare reactie trimisa de studenti (tipul reactiei, momentul de timp si activitatea de care apartine).

## 5. API Endpoints (Plan initial)

### Autentificare (Profesori)
* `POST /api/auth/register` - Inregistrare profesor nou.
* `POST /api/auth/login` - Login profesor.

### Activitati (Gestionate de Profesor)
* `POST /api/activities` - Creare activitate noua.
* `GET /api/activities` - Preluare lista cu toate activitatile profesorului logat.
* `GET /api/activities/:id` - Preluare detalii despre o activitate si toate feedback-urile asociate.

### Feedback (Rute publice / Studenti)
* `POST /api/join` - Verificare cod acces (Body: `{ access_code }`).
* `POST /api/feedback` - Studentul trimite o reactie (Body: `{ access_code, feedback_type }`).

## 6. Plan de Proiect (Timeline)

* **Now (Nov 16):** Specs + repository setup
* **By Dec 6:** Functional backend with REST API
* **By late Dec:** React frontend + complete integrations

*\*Nota: Acest README va fi actualizat pe masura ce proiectul avanseaza.*