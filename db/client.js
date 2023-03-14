const { client } = require("pg");
require("dotenv").config();

const DB_NAME = "homewardhound";

const DB_URL = process.env.DATABASE_URL || `http://localhost:5173/${DB_NAME}`;

let client;

// github actions client config ALSO MIGHT DELETE LATER
if (process.env.CI) {
  client = new client({
    host: "localhost",
    port: 5173,
    user: "postgres",
    password: "postgres",
    database: "postgres",
  });
} else {
  client = new Client(DB_URL);
}
module.exports = client;
