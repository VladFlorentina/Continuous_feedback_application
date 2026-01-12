const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const db = require('./config/database');
const authRoutes = require('./routes/auth');
const activityRoutes = require('./routes/activity');
const studentRoutes = require('./routes/student');
const adminRoutes = require('./routes/admin');
require('dotenv').config();


/**
 * @file index.js
 * @description Punctul de intrare al serverului backend.
 * Configureaza Express, Socket.io, middleware-urile si conexiunea la baza de date.
 */

// Initializarea aplicatiei Express si a serverului HTTP
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

// Configurare Socket.IO pentru comunicare in timp real (CORS permisiv pentru dezvoltare)
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Salvam instanta io in app pentru a o putea accesa din rute
app.set('io', io);

// Middleware pentru parsarea JSON
app.use(express.json());

// Configurare CORS pentru a permite cereri de la frontend
const cors = require('cors');
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token']
}));


// Definirea rutelor API
app.use('/api/auth', authRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api', studentRoutes); // Rute publice pentru studenti
app.use('/api/admin', adminRoutes);

// Ruta de baza pentru verificare health-check
app.get('/', (req, res) => {
  res.send('Server functional!');
});

/**
 * Porneste serverul si realizeaza conexiunea la baza de date.
 * Sincronizeaza modelele Sequelize cu baza de date.
 */
async function startServer() {
  try {
    // Autentificare la baza de date
    await db.sequelize.authenticate();
    console.log('Conexiune BD stabilita cu succes.');

    // Sincronizare tabele (alter: true actualizeaza schema fara a sterge datele)
    await db.sequelize.sync({ alter: true });
    console.log('Tabele sincronizate.');

    // Pornire ascultare pe portul definit
    server.listen(PORT, '0.0.0.0', () => {
      console.log(`Server ruland pe portul ${PORT} (accesibil din retea)`);
    });
  } catch (error) {
    console.error('Eroare BD:', error.message);
  }
}

// Pornim serverul doar daca fisierul este rulat direct (nu importat in teste)
if (require.main === module) {
  startServer();
}

module.exports = { app, server };