const express = require("express");
const apiController = require("./src/controllers");
const { PORT } = require("./consts");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api", apiController);

app.listen(PORT, () => {
  console.log(`Express Running on ${PORT}`);
});
