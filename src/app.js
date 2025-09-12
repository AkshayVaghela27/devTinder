const express = require("express");
const CookieParser = require("cookie-parser");
const connectDB = require("./config/database");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const paymentRouter = require("./routes/payment");
const chatRouter = require("./routes/chat");
const initializeSocket = require("./utils/socket");
const cors = require("cors");

const http = require("http");

require("dotenv").config();

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

app.use("/", paymentRouter);

app.use("/", chatRouter);

const server = http.createServer(app);

initializeSocket(server);

connectDB()
  .then(() => {
    console.log("Database connection successfully");
    server.listen(process.env.PORT, () => {
      console.log("port running on 7777");
    });
  })
  .catch((err) => {
    console.error("Database not connected");
  });
