require("dotenv").config();

const PORT = process.env.PORT ?? 8080;
const MONGO_DB_URL = process.env.MONGO_DB_URL;
const MONGO_DB_NAME = process.env.MONGO_DB_NAME;

module.exports = {
  PORT,
  MONGO_DB_URL,
  MONGO_DB_NAME,
};
