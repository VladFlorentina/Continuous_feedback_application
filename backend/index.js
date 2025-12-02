const express = require('express');
const db = require('./config/database'); 
const authRoutes = require('./routes/auth');
const activityRoutes = require('./routes/activity'); 
const studentRoutes = require('./routes/student'); // Rutele noi
require('dotenv').config(); 

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Rute
app.use('/api/auth', authRoutes);
app.use('/api/activities', activityRoutes); 
app.use('/api', studentRoutes); // Rute publice

app.get('/', (req, res) => {
  res.send('Server functional!');
});

async function startServer() {
  try {
    await db.sequelize.authenticate();
    console.log('Conexiune BD stabilita cu succes.');
    await db.sequelize.sync({ alter: true }); 
    console.log('Tabele sincronizate.');
    app.listen(PORT, () => {
      console.log(`Server ruland pe portul ${PORT}`);
    });
  } catch (error) {
    console.error('Eroare BD:', error.message);
  }
}

startServer();