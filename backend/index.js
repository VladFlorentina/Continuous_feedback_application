const express = require('express');
const db = require('./config/database');
const authRoutes = require('./routes/auth');
const activityRoutes = require('./routes/activity');
const studentRoutes = require('./routes/student');
const adminRoutes = require('./routes/admin');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
const cors = require('cors');
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token']
}));

// Rute
app.use('/api/auth', authRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api', studentRoutes);
app.use('/api/admin', adminRoutes); // Rute publice

app.get('/', (req, res) => {
  res.send('Server functional!');
});

async function startServer() {
  try {
    await db.sequelize.authenticate();
    console.log('Conexiune BD stabilita cu succes.');
    await db.sequelize.sync({ alter: true });
    console.log('Tabele sincronizate.');
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server ruland pe portul ${PORT} (accesibil din retea)`);
    });
  } catch (error) {
    console.error('Eroare BD:', error.message);
  }
}

startServer();