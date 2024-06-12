const { Pool } = require("pg");
const { parse } = require("pg-connection-string");


const ENV = process.env.NODE_ENV || "development";

const path = `${__dirname}/../.env.${ENV}`;


require("dotenv").config({ path });

if (process.env.DATABASE_URL) {
    const config = parse(process.env.DATABASE_URL);
    process.env.PGDATABASE = config.database;
    process.env.PGUSER = config.user;
    process.env.PGPASSWORD = config.password;
    process.env.PGHOST = config.host;
    process.env.PGPORT = config.port;
}

if (!process.env.PGDATABASE) {
    throw new Error("PGDATABASE not set");
}

module.exports = new Pool();