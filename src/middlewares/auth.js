const jwt = require("jsonwebtoken");
const User = require("../models/user");
const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).send("Please Login.");
    }
    const { _id } = await jwt.verify(token, "DevTinder@3345");
    const user = await User.findById({ _id: _id });
    if (!user) {
      throw new Error("User doesn't exist.");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(500).send("Error : " + err.message);
  }
};

module.exports = { userAuth };
