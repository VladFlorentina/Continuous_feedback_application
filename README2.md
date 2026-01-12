# Raport de Progres - Aplicatie Feedback Continuu

## 1. Introducere
Acest document detaliaza contributiile aduse proiectului pentru a atinge stadiul final de functionalitate.

## 2. Ce am facut pana acum (Raport de Progres)

Salut! Aici este jurnalul modificarilor pe care le-am facut eu pentru a aduce proiectul la stadiul functional final.

### Configurarea Initiala si Backend
*   **Rezolvat problemele de dependinte:** Am avut probleme cu libraria `bcrypt` pe Windows, asa ca am inlocuit-o cu `bcryptjs`, care este mult mai stabila si nu necesita compilare nativa.
*   **Baza de date:** Am creat un script automat (`create_db.js`) care verifica si instaleaza baza de date PostgreSQL daca aceasta nu exista.
*   **Securitate:** Am scos toate datele sensibile (parole, secrete) din cod si le-am mutat intr-un fisier `.env`, care nu se urca pe Git.

### Vizibilitate si Retea (Mobil)
*   **Acces din retea:** Initial, serverul mergea doar pe `localhost`. Am modificat configurarea serverului Express sa asculte pe `0.0.0.0` (toate interfetele) si am updatat configuratia Vite (`vite.config.js`) cu `host: true`.
*   **IP Dinamic:** Am scris un mic script in frontend (`api.js`) care detecteaza automat IP-ul calculatorului, astfel incat sa poti intra de pe telefon fara sa schimbi manual codul sursa de fiecare data cand ti se schimba IP-ul.

### Functionalitati Noi
*   **Timeline View (Grafice):** Colega mea facuse doar partea de totaluri. Eu am adaugat o librarie de grafice (`recharts`) si am implementat logica matematica in `ActivityDetails.jsx` pentru a grupa feedback-ul pe intervale de timp (la fiecare 10 secunde). Acum putem vedea "pulsul" clasei in timp real.
*   **CORS:** Am rezolvat erorile de Cross-Origin, astfel incat frontend-ul (port 5173) sa poata vorbi cu backend-ul (port 3000) fara blocaje de securitate in browser.
*   **WebSockets (Socket.io):** Am inlocuit sistemul vechi de "polling" (actualizare la 3 secunde) cu `Socket.io`. Acum, pagina de statistici este cu adevarat live - se actualizeaza instantaneu cand un student apasa un emoticon, fara a incarca inutil serverul.
*   **Export CSV:** Am adaugat un buton in pagina activitatii care permite profesorului sa descarce toate feedback-urile intr-un fisier CSV, pentru analiza ulterioara.
*   **Validare Input:** Am securizat formularul de inregistrare si login folosind `express-validator`, pentru a preveni introducerea de date invalide sau malitioase.

### Design si Interfata
*   **Curatenie in cod:** Am trecut prin toate fisierele si am scos diacriticele (ex: "ș" -> "s") pentru a evita problemele de afisare (encoding) pe unele browsere sau terminale vechi.
*   **UI Premium:** Am refacut pagina de feedback pentru studenti folosind un stil "Glassmorphism" (translucid), butoane mari si animatii la click, ca sa arate bine pe ecranele telefoanelor.
*   **Setari Profil:** Am creat o pagina de profil unde utilizatorii (profesorii) isi pot schimba numele si parola. Schimbarea parolei cere confirmarea celei vechi pentru securitate sporita.

### Panou Administrator si Gestiune Roluri
*   **Roluri Utilizatori:** Am implementat un sistem de roluri (admin, professor) in baza de date. Acum, la login, aplicatia stie sa redirectioneze automat profesorii catre dashboard-ul lor si administratorii catre pagina de statistici.
*   **Dashboard Admin:** Am construit o pagina noua dedicata administratorilor (`/admin`), unde se pot vedea statistici in timp real despre toata aplicatia: cati utilizatori sunt, cate activitati au fost create si cate feedback-uri s-au strans in total.
*   **Script Admin:** Pentru a usura munca, am facut un script `create_admin.js` care iti permite sa creezi rapid un cont de admin fara sa umbli manual in baza de date.

## 3. Cum se ruleaza proiectul acum

1.  **Backend:**
    ```bash
    cd backend
    npm install
    node index.js
    ```
2.  **Frontend:**
    ```bash
    cd frontend
    npm install
    npm run dev -- --host
    ```

3.  **Docker (Nou!):**
    Daca nu vrei sa instalezi nimic, poti rula totul cu o singura comanda (daca ai Docker instalat):
    ```bash
    docker-compose up --build
    ```

## 4. Tehnologii Adaugate de mine
*   `recharts` - pentru grafice.
*   `cors` - pentru securitate si vizibilitate retea.
*   `bcryptjs` - pentru autentificare stabila.
*   `socket.io` & `socket.io-client` - pentru comunicare in timp real (websockets).
*   `express-validator` - pentru validarea datelor de intrare.
*   `Docker` - pentru containerizarea aplicatiei.
