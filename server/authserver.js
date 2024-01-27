const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const path = require("path");
const morgan = require("morgan");

const user = require("./models/user.model");
const app = express();
const port = process.env.PORT || 5000;

const uri = process.env.DB_URL;

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));

mongoose.connect(uri, {
  useNewUrlParser: true,
  // useCreateIndex: true,
  useUnifiedTopology: true,
});

mongoose.connection.once("open", () => {
  console.log("connection established successfully");
  console.log("Database:", mongoose.connection.db.databaseName);
  console.log("Collection:", user.collection.name);
});

const userRouter = require("./routes/user");
const testRouter = require("./routes/test");
const adminQuestionRouter = require("./routes/adminQuestion");
app.get("/", function (req, res) {
  res.send("Hello World");
});

app.use("/api/user", userRouter);
app.use("/api/test", testRouter);
app.use("/api/adminQuestion", adminQuestionRouter);

if (
  process.env.NODE_ENV === "production" ||
  process.env.NODE_ENV === "staging"
) {
  app.use(express.static("client/build"));

  app.all("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });
}

app.listen(
  port,
  "0.0.0.0",
  console.log(`listing at port  http://localhost:${port}`)
);
