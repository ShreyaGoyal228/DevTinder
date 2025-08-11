const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");

//signup api
authRouter.post("/signup", async (req, res) => {
  try {
    //validate the data (already done through schema) and then encrypt the password and then save into the database
    const {
      firstName,
      lastName,
      about,
      emailId,
      photoUrl,
      skills,
      age,
      gender,
    } = req.body;

    //encrypt the password
    const password = req.body.password;
    const hashedPass = await bcrypt.hash(password, 10);

    // we are creating the new instance of model User
    const user = new User({
      firstName,
      lastName,
      password: hashedPass,
      about,
      emailId,
      photoUrl,
      skills,
      age,
      gender,
    });

    //on saving a new document was created into the user collection in database
    await user.save();
    res.send("User added successfully!");
  } catch (err) {
    res.status(400).send("Error saving the user : " + err.message);
  }
});

//login api
authRouter.post("/login", async (req, res) => {
  const { emailId, password } = req.body;

  try {
    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      throw new Error("Invalid Credentials.");
    }
    //check the password
    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      throw new Error("Invalid Credentials.");
    }

    //Create the jwt token
    // const token = await jwt.sign({ _id: user._id }, "DevTinder@3345", {
    //   expiresIn: "1d",
    // });
    const token = await user.getJWT();
    //and send it to the cookies
    res.cookie("token", token);
    res.send("Login succesfull.");
  } catch (err) {
    res.status(400).send("Error in logging in : " + err.message);
  }
});

//logout api
authRouter.post("/logout", (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.send("Logout successfull.");
});

module.exports = { authRouter };
