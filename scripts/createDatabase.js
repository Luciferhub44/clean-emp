import pg from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: `${__dirname}/../.env` });

const { Client } = pg;

async function createDatabase() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? {
      rejectUnauthorized: false
    } : false
  });

  try {
    await client.connect();
    // Database is already created in the hosted environment
    console.log('Database connection successful');
  } catch (err) {
    console.error('Error connecting to database:', err);
    throw err;
  } finally {
    await client.end();
  }
}

createDatabase().catch(console.error); 