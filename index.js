const express = require("express");
const apiController = require("./src/controllers");
const config = require("./consts");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api", apiController);

app.listen(config.app.port, () => {
  console.log(`Express Running on ${config.app.port}`);
});
