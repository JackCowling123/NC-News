const { Pool } = require('pg');
const path = require('path');
const ENV = process.env.NODE_ENV || 'development';
const config = {};

// Load environment variables from the appropriate .env file
require('dotenv').config({
  path: path.resolve(__dirname, `../.env.${ENV}`)
});

// Log the environment to ensure it's being set correctly
console.log('Environment:', ENV);

if (ENV === 'production') {
  config.connectionString = process.env.DATABASE_URL;
  config.max = 2;  // Adjust max connections if needed
} else {
  config.user = process.env.PGUSER;
  config.host = process.env.PGHOST;
  config.database = process.env.PGDATABASE;
  config.password = process.env.PGPASSWORD;
  config.port = process.env.PGPORT;

  // Log the loaded configuration for debugging
  console.log('Database Config:', config);

  if (!config.database) {
    throw new Error('PGDATABASE not set in development environment');
  }
}

if (!config.connectionString && !config.database) {
  throw new Error('Database connection configuration is missing');
}

module.exports = new Pool(config);