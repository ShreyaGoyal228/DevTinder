const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const connectDb = require("./config/database");
const cookieParser = require("cookie-parser");
const { authRouter } = require("./router/auth");
const { profileRouter } = require("./router/profile");
const { requestRouter } = require("./router/request");
const userRouter = require("./router/userRouter");
const paymentRouter = require("./router/payment");
app.use(
  cors({
    origin: "http://localhost:5173", //specify the exact origin of your frontend
    credentials: true,
  })
);
app.use(express.json());
//to read the token value from the cookies we need cookie-parser
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", paymentRouter);

connectDb()
  .then(() => {
    console.log("Database connected successfully.");
    app.listen(process.env.PORT, "0.0.0.0", () => {
      console.log("Server stared at 3002");
    });
  })
  .catch((err) => {
    console.log("Error in establishing databse connection");
  });
