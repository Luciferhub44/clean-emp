import pg from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: `${__dirname}/../.env` });

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function seedDatabase() {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // Get employee role id
    const { rows: [employeeRole] } = await client.query(
      'SELECT id FROM roles WHERE name = $1',
      ['employee']
    );

    // Create test employees
    const testEmployees = [
      {
        email: 'john.doe@cleanteam.com',
        password: 'employee123',
        first_name: 'John',
        last_name: 'Doe',
      },
      {
        email: 'jane.smith@cleanteam.com',
        password: 'employee123',
        first_name: 'Jane',
        last_name: 'Smith',
      },
    ];

    for (const employee of testEmployees) {
      const passwordHash = await bcrypt.hash(employee.password, 10);
      
      await client.query(`
        INSERT INTO users (
          email, 
          password_hash, 
          first_name, 
          last_name, 
          role_id,
          profile_confirmed
        ) VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (email) DO NOTHING
      `, [
        employee.email,
        passwordHash,
        employee.first_name,
        employee.last_name,
        employeeRole.id,
        false
      ]);
    }

    await client.query('COMMIT');
    console.log('Database seeded successfully');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error seeding database:', err);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

seedDatabase().catch(console.error); 