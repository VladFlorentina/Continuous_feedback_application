/**
 * script pentru crearea bazei de date postgresql daca nu exista
 */
const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'Madalina88.',
  host: process.env.DB_HOST || 'localhost',
  port: 5432,
  database: 'postgres'
});

async function createDb() {
  const dbName = process.env.DB_NAME || 'feedback_app';
  try {
    await client.connect();
    await client.query(`CREATE DATABASE ${dbName};`);
    console.log(`Database ${dbName} created successfully.`);
  } catch (err) {
    if (err.code === '42P04') {
      console.log(`Database ${dbName} already exists.`);
    } else {
      console.error('Error creating database:', err);
    }
  } finally {
    await client.end();
  }
}

createDb();
