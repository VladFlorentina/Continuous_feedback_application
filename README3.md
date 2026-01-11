# Roadmap catre Versiunea Finala (v1.0) - Continuous Feedback App

Salut! Pana acum am adus aplicatia intr-un stadiu functional foarte bun , dar pentru a o considera completa  mai am cateva lucruri importante de pus la punct.

Aici este lista mea cu ce a mai ramas de facut:

## 1. Functionalitati Utilitare 

Acestea sunt functii pe care un utilizator obisnuit se asteapta sa le gaseasca in orice aplicatie serioasa.

*   **Exportarea Datelor (CSV/PDF):**
    *   *Situatie curenta:* Profesorul vede graficele pe ecran, dar datele raman "captive" acolo.
    *   *Ce trebuie sa fac:* Sa adaug un buton "Descarca Raport" in pagina `ActivityDetails`. Acesta va genera un fisier Excel sau PDF cu toate feedback-urile primite, ca profesorul sa le poata arhiva sau analiza mai tarziu.

*   **Editare Profil si Securitate:**
    *   *Situatie curenta:* Odata creat contul, nu iti mai poti schimba parola sau numele.
    *   *Ce trebuie sa fac:* O pagina simpla de "Setari Profil" unde utilizatorul sa poata schimba parola curenta si sa isi actualizeze datele.

*   **Mesaje de Feedback Vizuale **
    *   *Situatie curenta:* Cand apare o eroare (ex: parola gresita), uneori doar apare un text rosu mic sau nu se intampla nimic evident.
    *   *Ce trebuie sa fac:* Sa implementez un sistem de notificari (toasts/snackbars) care sa apara elegant in coltul ecranului ("Salvat cu succes!", "Eroare de conexiune" etc.).

## 2. Optimizari Tehnice 

*   **Trecerea la WebSockets **
    *   *Situatie curenta:* Acum, graficele se actualizeaza cerand date de la server din 3 in 3 secunde (`setInterval`).
    *   *Ce trebuie sa fac:* Sa inlocuiesc acest "polling" cu `Socket.io`. Astfel, serverul va trimite date frontend-ului doar cand un student apasa un buton. 

*   **Validare  (Backend):**
    *   *Situatie curenta:* Verificam datele, 
    *   *Ce trebuie sa fac:* Sa adaug `express-validator` pentru a ne asigura ca nimeni nu poate trimite date malitioase in baza de date 

## 3. Pregatirea pentru Lansare (Deploy)

*   **Containerizare (Docker):**
    *   *Ce trebuie sa fac:* Sa creez fisiere `Dockerfile` si `docker-compose.yml`. Asta va permite oricui sa porneasca toata aplicatia (baza de date + backend + frontend) cu o singura comanda (`docker-compose up`), fara sa instaleze Node.js sau Postgres manual.

*   **Mediu de Productie:**
    *   *Ce trebuie sa fac:* Configurare Nginx pentru a servi fisierele statice de frontend si a face proxy catre backend, plus activarea HTTPS (SSL) pentru securitate.

## 4. Testare si Calitate

*   **Teste Automate:**
    *   *Ce trebuie sa fac:* Sa scriu cateva teste unitare (folosind `Jest`) pentru functiile critice din backend (login, calcul statistici). Asta ma asigura ca daca modific ceva in viitor, nu stric functionalitatile existente.
