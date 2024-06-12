const { Pool } = require("pg");

const ENV = process.env.NODE_ENV || "development";

const path = `${__dirname}/../.env.${ENV}`;

console.log(path);

require("dotenv").config({ path });

if (!process.env.PGDATABASE) {
    throw new Error("PGDATABASE not set");
}

module.exports = new Pool();