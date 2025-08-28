const express = require("express");
const CookieParser = require("cookie-parser")
const connectDB = require("./config/database");
const authRouter = require("./routes/auth")
const profileRouter = require("./routes/profile")
const app = express();

app.use(express.json());
app.use(CookieParser())

app.use("/",authRouter)

app.use("/",profileRouter)

connectDB()
  .then(() => {
    console.log("Database connection successfully");
    app.listen(7777, () => {
      console.log("port running on 7777");
    });
  })
  .catch((err) => {
    console.error("Database not connected");
  });
