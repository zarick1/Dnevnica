require('dotenv').config();
const pool = require('./pool');

const sql = `
CREATE TABLE IF NOT EXISTS ads (
  id SERIAL PRIMARY KEY,
  type VARCHAR(20) NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXt NOT NULL,
  city VARCHAR(100),
  pay INTEGER,
  contact_name VARCHAR(100) NOT NULL,
  contact_phone VARCHAR(50),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
)
`;

async function migrate() {
  try {
    console.log('Running migrations....');
    await pool.query(sql);
    console.log('Migration completed.');
  } catch (err) {
    console.error('Migration error: ', err);
  } finally {
    await pool.end();
    process.exit(0);
  }
}

migrate();
