const express = require("express");

const connectDB = require("./config/database");

const app = express();

connectDB().then(() => {
  console.log("Database connection successfully");
  app.listen(7777, () => {
    console.log("port running on 7777");
  });
}).catch((err) => {
    console.error("Database not connected")
})
