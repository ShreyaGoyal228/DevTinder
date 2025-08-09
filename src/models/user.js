const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: {
    type: String,
  },
  emailId: String,
  password:{
    type:String
  },
  age: Number,
  gender: String,
});

const User = mongoose.model("User", userSchema);
module.exports = User;
