const express = require("express");
const app = express();
const connectDb = require("./config/database");
const cookieParser = require("cookie-parser");
const { authRouter } = require("../router/auth");
const { profileRouter } = require("../router/profile");
const { requestRouter } = require("../router/request");

app.use(express.json());
//to read the token value from the cookies we need cookie-parser
app.use(cookieParser());

app.use("/",authRouter)
app.use("/",profileRouter)
app.use("/",requestRouter)

connectDb()
  .then(() => {
    console.log("Database connected successfully.");
    app.listen(3002, () => {
      console.log("Server stared at 3002");
    });
  })
  .catch((err) => {
    console.log("Error in establishing databse connection");
  });
