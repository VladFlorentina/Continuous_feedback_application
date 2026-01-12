const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    port: 5432,
});

async function test() {
    try {
        console.log("Connecting...");
        await client.connect();
        console.log("Connected successfully!");
        await client.end();
    } catch (err) {
        console.error("Connection failed:", err);
    }
}

test();
