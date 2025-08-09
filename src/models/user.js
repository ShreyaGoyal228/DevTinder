const mongoose = require("mongoose");
const validator = require("validator");
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: [2, "FirstName should be of atleast 3 chars."],
      maxLength: [20, "LastName can be of max 20 chars."],
    },
    lastName: {
      type: String,
      required: true,
      minLength: [2, "LastName should be of atleast 6 chars."],
      maxLength: [20, "LastName can be of max 20 chars."],
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Enter correct email address.");
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Enter strong password.");
        }
      },
      // maxLength: [100, "Password can be of max 20 chars."],
    },
    about: {
      type: String,
      default: "Here is the default about section for each user.",
    },
    skills: {
      type: [String],
      validate(value) {
        if (value.length > 10) {
          throw new Error("Maximum of 10 skills can be added.");
        }
      },
    },
    age: {
      type: Number,
      min: [18, "Age should be min of 18 years."],
    },
    gender: {
      type: String,
      lowercase: true,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Enter valid gender.");
        }
      },
    },
    photoUrl: {
      type: String,
      default:
        "https://toppng.b-cdn.net/uploads/preview/donna-picarro-dummy-avatar-115633298255iautrofxa.png",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Enter correct photo url.");
        }
      },
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
