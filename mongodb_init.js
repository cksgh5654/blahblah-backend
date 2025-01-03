const mongoose = require("mongoose");

const { MONGO_DB_URL, MONGO_DB_NAME } = require("./consts/index");

mongoose
  .connect(MONGO_DB_URL, { dbName: MONGO_DB_NAME })
  .then(() => console.log("MongoDB Connected"))
  .catch((error) => console.log("fail to connect mongoDB", error));

module.exports = mongoose;
