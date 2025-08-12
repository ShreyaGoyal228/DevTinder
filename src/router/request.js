const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");

requestRouter.post(
  "/request/sent/:status/:userId",
  userAuth,
  async (req, res) => {
    try {
      const { status } = req.params;
      const fromUserId = req.user._id;
      const toUserId = req.params.userId;

      const ALLOWED_STATUS = ["interested", "ignore"];
      if (!ALLOWED_STATUS.includes(status)) {
        throw new Error(`${status} is not a valid status.`);
      }

      const userFound = await User.findById(toUserId);
      if (!userFound) {
        throw new Error(
          "The user you want to sent request to does not exists."
        );
      }

      const existingConnectionReq = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionReq) {
        throw new Error("Connection Request exists already.");
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      await connectionRequest.save();
      res.send({ message: "Connection Request sent successfully" });
    } catch (err) {
      res.status(400).send({ message: err.message });
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const { status, requestId } = req.params;
      const loggedInUser = req.user;

      const ALLOWED_STATUS = ["accepted", "rejected"];
      if (!ALLOWED_STATUS.includes(status)) {
        throw new Error(`${status} is not a valid status.`);
      }

      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });

      if (!connectionRequest) {
        throw new Error("Connection request not found.");
      }

      connectionRequest.status = status;
      await connectionRequest.save();
      res.send({ message: `Connection request ${status} successfully.` });
    } catch (err) {
      res.status(400).send("Error :" + err.message);
    }
  }
);

module.exports = { requestRouter };
