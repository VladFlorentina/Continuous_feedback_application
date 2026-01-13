# aplicatie feedback - frontend

acesta este folderul pentru partea de client (frontend) a aplicatiei.

## tehnologii folosite
* **react.js** - biblioteca principala pentru interfata.
* **vite** - build tool rapid pentru dezvoltare.
* **material ui (@mui)** - componente gata stilizate (butoane, carduri).
* **axios** - pentru comunicarea cu backend-ul.
* **socket.io-client** - pentru actualizari in timp real.
* **recharts** - pentru graficele de evolutie a feedback-ului.

## structura proiectului
codul sursa se afla in folderul `src`:

* **components/**
    * `ProtectedRoute.jsx` - blocheaza accesul neautorizat la pagini.
* **pages/**
    * `Login.jsx` & `Register.jsx` - autentificare.
    * `Profile.jsx` - setari si schimbare parola.
    * `ProfessorDashboard.jsx` - lista activitatilor profesorului.
    * `CreateActivity.jsx` - generare cod qr si activitate noua.
    * `ActivityDetails.jsx` - statistici si grafice live.
    * `StudentJoin.jsx` - studentii introduc codul aici.
    * `StudentFeedback.jsx` - interfata de votare (emoticoane).
    * `AdminDashboard.jsx` - panou administrare utilizatori.
* **services/**
    * `api.js` - configurare axios cu interceptori pentru token.

## instalare si rulare

1. **instalare dependinte**:
   ```bash
   npm install
   ```

2. **configurare mediu**:
   creeaza un fisier `.env` in folderul `frontend` (langa package.json):
   ```env
   VITE_API_URL=http://localhost:3000/api
   ```
   *nota*: pentru productie (render), url-ul va fi diferit.

3. **pornire aplicatie**:
   ```bash
   npm run dev
   ```
   aplicatia va rula de obicei pe `http://localhost:5173`.