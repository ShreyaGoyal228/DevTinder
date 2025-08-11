const express=require("express");
const requestRouter=express.Router()
const { userAuth } =  require("../src/middlewares/auth");

requestRouter.post("/sendConnectionReq", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user.firstName + " sent the connection request.");
  } catch (err) {
    res.status(500).send("Error : " + err.message);
  }
});

module.exports={requestRouter}