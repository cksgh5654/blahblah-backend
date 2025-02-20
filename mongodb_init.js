const mongoose = require("mongoose");
const config = require("./consts");

mongoose
  .connect(config.database.url, { dbName: config.database.name })
  .then(() => console.log("MongoDB Connected"))
  .catch((error) => console.log("fail to connect mongoDB", error));

module.exports = mongoose;
