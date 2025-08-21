const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const userRouter = express.Router();
const ALLOWED_FIELDS = [
  "firstName",
  "lastName",
  "gender",
  "age",
  "about",
  "skills",
  "photoUrl",
];
userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    //Connections can be there : user can send the request to someone and can also receive it from another
    const connections = await ConnectionRequest.find({
      $or: [
        { status: "accepted", fromUserId: loggedInUser._id },
        { status: "accepted", toUserId: loggedInUser._id },
      ],
    })
      .populate("fromUserId", ALLOWED_FIELDS)
      .populate("toUserId", ALLOWED_FIELDS);

    //we need to find out exactly
    const data = connections.map((row) => {
      if (row.fromUserId._id.equals(loggedInUser._id)) {
        return row.toUserId;
      }
      return row.fromUserId;
    });
    res.send(data);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const requestsReceived = await ConnectionRequest.find({
      status: "interested",
      toUserId: loggedInUser._id,
    }).populate("fromUserId", ALLOWED_FIELDS);
    res.send(requestsReceived);
  } catch (err) {
    res.status(400).send(err.message);
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

userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    let limit = req.query.limit || 10;
    limit = limit > 50 ? 50 : limit;
    const page = req.query.page || 1;

    const skip = (page - 1) * limit;
    const loggedInUser = req.user;

    // connection request (sent + received)
    const connections = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    });

    const hideUsersFromFeed = new Set();
    connections.forEach((row) => {
      hideUsersFromFeed.add(row.fromUserId.toString());
      hideUsersFromFeed.add(row.toUserId.toString());
    });

    //if in case there isn't any connection request then we will hide the logged in user from the feed
    hideUsersFromFeed.add(loggedInUser._id.toString());

    const feedUsers = await User.find({
      _id: { $nin: Array.from(hideUsersFromFeed) },
    })
      .select([
        "firstName",
        "lastName",
        "age",
        "gender",
        "skills",
        "photoUrl",
        "about",
      ])
      .skip(skip)
      .limit(limit);

    res.send(feedUsers);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = userRouter;
