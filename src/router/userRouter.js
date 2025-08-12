const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const userRouter = express.Router();

// userRouter.get("/user/connections",async(req,res)=>{

// })

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const requestsReceived = await ConnectionRequest.find({
      status: "interested",
      toUserId: loggedInUser._id,
    }).populate("fromUserId", [
      "firstName",
      "lastName",
      "gender",
      "age",
      "about",
      "skills",
      "photoUrl",
    ]);
    res.send({ message: "Received requests: ", data: requestsReceived });
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
});

userRouter.get("/user/requests/send", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequest.find({
      fromUserId: loggedInUser._id,
      status: "interested",
    }).populate("toUserId", [
      "firstName",
      "lastName",
      "gender",
      "age",
      "about",
      "skills",
      "photoUrl",
    ]);
    res.send({
      message: "Connection requests sent are : ",
      data: connectionRequest,
    });
  } catch (err) {
    res.status(400).send("Error :" + err.message);
  }
});

module.exports = userRouter;
