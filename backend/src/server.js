require("dotenv").config();
const cors = require("cors");
const morgan = require("morgan");
const express = require("express");
const { mongoDB, redis } = require("./config");
const routes = require("./routes");
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoDB.connect();
redis.connect();

app.use("/api/v1", routes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
