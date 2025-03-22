require("dotenv").config();
const cors = require("cors");
const morgan = require("morgan");
const express = require("express");
const { mongoDB } = require("./config");
const routes = require("./routes");
const http = require("http");
const { initSocket } = require("./socket");

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3000;

app.use(cors());
app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoDB.connect();
initSocket(server);

app.use("/api/v1", routes);

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
