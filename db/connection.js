const { Pool } = require('pg');
const path = require('path');
const ENV = process.env.NODE_ENV || 'development';
const config = {};

require('dotenv').config({
  path: path.resolve(__dirname, `../.env.${ENV}`)
});

if (ENV === 'production') {
  config.connectionString = process.env.DATABASE_URL;
  config.max = 2;  // Adjust max connections if needed
} else {
  config.user = process.env.PGUSER;
  config.host = process.env.PGHOST;
  config.database = process.env.PGDATABASE;
  config.password = process.env.PGPASSWORD;
  config.port = process.env.PGPORT;

  if (!config.database) {
    throw new Error('PGDATABASE not set in development environment');
  }
}

module.exports = new Pool(config);