const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on('error', err => {
  console.error('POSTGRES pool error: ', err);
});

module.exports = pool;
