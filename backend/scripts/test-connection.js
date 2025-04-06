const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function testConnection() {
  try {
    console.log('Attempting to connect to the database...');
    await client.connect();
    console.log('Successfully connected to the database');
    
    const result = await client.query('SELECT NOW()');
    console.log('Current time:', result.rows[0].now);
    
    await client.end();
    process.exit(0);
  } catch (err) {
    console.error('Error connecting to the database:', err);
    if (client) {
      await client.end();
    }
    process.exit(1);
  }
}

testConnection(); 