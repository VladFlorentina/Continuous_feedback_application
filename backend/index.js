const express = require('express');
const db = require('./config/database'); 
const authRoutes = require('./routes/auth');
const activityRoutes = require('./routes/activity'); 
require('dotenv').config({ path: '../.env' }); 

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/activities', activityRoutes); 

app.get('/', (req, res) => {
  res.send('Serverul ruleaza. Verific conexiunea BD.');
});

async function startServer() {
  try {
    await db.sequelize.authenticate();
    console.log('Conexiune BD stabilita cu succes.');

    await db.sequelize.sync({ force: false }); 
    console.log('Tabele sincronizate.');

    app.listen(PORT, () => {
      console.log(`Server ruland pe portul ${PORT}`);
    });
  } catch (error) {
    console.error('Eroare BD:', error.message);
    process.exit(1);
  }
}

startServer();