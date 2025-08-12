const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const {
  validateEditProfileData,
  strongPasswordChecker,
} = require("../utils/validate");

//profile view api
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("Error in getting the profile : " + err.message);
  }
});

//profile edit api
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  //validate whether the profile data you have provided will be able to update or not
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Edit Profile data is invalid.");
    }

    const user = req.user;
    const updatedUser = await User.findByIdAndUpdate(user._id, req.body, {
      runValidators: true,
      returnDocument: "after",
    });
    res.json({
      message: `${updatedUser.firstName} updated successfully.`,
      data: updatedUser,
    });
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
});

//profile password update api
profileRouter.patch("/profile/changePassword", userAuth, async (req, res) => {
  const { oldPass, newPass } = req.body;
  const user = req.user;
  const hashedOldPass = user.password;
  try {
    //match the old Password
    const doesOldPasswordMatch = await bcrypt.compare(oldPass, hashedOldPass);
    if (!doesOldPasswordMatch) {
      throw new Error("Original Password does not match.");
    }

    //old and new Pass can't be same
    if (oldPass === newPass) {
      throw new Error("Old and new passwords can't be same.");
    }

    //check whether the new pass is strong or not
    if (!strongPasswordChecker(newPass)) {
      throw new Error("New Password is not strong.");
    }

    //hash th new Password
    const hashedNewPass = await bcrypt.hash(newPass, 10);

    // save it in the database
    await User.findByIdAndUpdate(
      user._id,
      { password: hashedNewPass },
      { runValidators: true, returnDocument: "after" }
    );

    //logout from the profile
    res.cookie("token", null, { expires: new Date(Date.now()) });

    res.send("Password updated successfully.");
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
});

module.exports = { profileRouter };
