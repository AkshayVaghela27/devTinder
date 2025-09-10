const express = require("express");
const CookieParser = require("cookie-parser");
const connectDB = require("./config/database");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const cors = require("cors");

require("dotenv").config()

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(CookieParser());

app.use("/", authRouter);

app.use("/", profileRouter);

app.use("/", requestRouter);

app.use("/", userRouter);

connectDB()
  .then(() => {
    console.log("Database connection successfully");
    app.listen(process.env.PORT, () => {
      console.log("port running on 7777");
    });
  })
  .catch((err) => {
    console.error("Database not connected");
  });
