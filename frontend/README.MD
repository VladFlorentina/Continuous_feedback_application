# aplicatie feedback - frontend (interfata)

acesta este folderul pentru partea de client (frontend) a aplicatiei noastre de feedback continuu. este facut cu react si vite.

## tehnologii folosite
* **React.js** - framework-ul principal.
* **Vite** - pentru a crea si rula proiectul rapid.
* **Material UI (@mui)** - librarie de componente pentru design (ca sa arate bine butoanele si formularele).
* **Axios** - pentru a face cereri catre backend (server).
* **React Router** - pentru navigarea intre pagini (login, dashboard, etc).

## cum se instaleaza si ruleaza

ca sa pornesti interfata, trebuie sa ai terminalul deschis in acest folder ("frontend") si sa urmezi pasii:

### pasul 1: instalarea dependentelor
scrie comanda asta ca sa descarci toate librariile necesare (node_modules):

npm install

### pasul 2: pornirea aplicatiei
dupa ce s-a terminat instalarea, scrie comanda:

npm run dev

o sa iti apara un link in terminal (de obicei http://localhost:5173). dai click pe el si se deschide site-ul in browser.

**nota importanta:** ca sa mearga logarea si datele, trebuie sa ai si serverul de backend pornit in alt terminal (cel de pe portul 3000).

## structura proiectului

codul sursa este in folderul `src`:

* **components/** - aici nu am pus mare lucru, e pentru bucati mici de cod refolosibile.
* **pages/** - aici sunt toate ecranele aplicatiei:
  * `Login.jsx` si `Register.jsx` - autentificare profesor.
  * `ProfessorDashboard.jsx` - pagina principala a profului unde vede activitatile.
  * `CreateActivity.jsx` - formularul unde se genereaza codul de acces si QR code-ul.
  * `ActivityDetails.jsx` - pagina unde profesorul vede in timp real voturile (se actualizeaza singura la 3 secunde).
  * `StudentJoin.jsx` - pagina unde studentul baga codul.
  * `StudentFeedback.jsx` - pagina cu cele 4 fete colorate pentru vot.
* **services/** - aici e fisierul `api.js` care face legatura cu backend-ul si pune automat token-ul de login la cereri.
* **App.jsx** - aici sunt definite rutele (cine la ce pagina duce).

## functionalitati gata

1. profesorul se poate inregistra si loga.
2. profesorul poate crea o activitate (primeste un cod unic si un QR code generat extern).
3. profesorul vede lista de activitati vechi.
4. studentul intra cu codul (fara cont).
5. studentul voteaza anonim cu emoticoane.
6. profesorul vede voturile cum se schimba in timp real.