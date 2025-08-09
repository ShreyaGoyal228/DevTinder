const express = require("express");
const app = express();
const connectDb = require("./config/database");
const bcrypt = require("bcrypt");
const User = require("./models/user");

app.use(express.json());

//signup api
app.post("/signup", async (req, res) => {
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
app.post("/login", async (req, res) => {
  const { emailId, password } = req.body;

  try {
    const user = await User.findOne({ emailId: emailId });
    
    if (!user) {
      throw new Error("Invalid Credentials.");
    }
    //check the password
    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );
    if (!isPasswordValid) {
      throw new Error("Invalid Credentials.");
    }
    res.send("Login succesfull.");
  } catch (err) {
    res.status(400).send("Error in logging in : " + err.message);
  }
});

//get the user by emailId
app.get("/user", async (req, res) => {
  const emailId = req.body.emailId;

  try {
    const user = await User.findOne({ emailId: emailId });
    console.log("user with this email is", user);
    res.send("User fetched successfully.");
  } catch (err) {
    console.log("Error in fetching the users :", err.message);
  }
});

//get the feed of users
app.get("/feed", async (req, res) => {
  try {
    const allUsers = await User.find({});
    console.log("all users are", allUsers);
    res.send("Users fetched successfully.");
  } catch (err) {
    console.log("Error in fetching the users :", err.message);
  }
});

//delete user api
app.delete("/delete", async (req, res) => {
  const userId = req.body.userId;
  try {
    const deleteUser = await User.findOneAndDelete({ _id: userId });
    console.log("delete user is", deleteUser);
    res.send("User deleted successfully.");
  } catch (err) {
    res.status(400).send("Error in deleting the user : " + err.message);
  }
});

//update user api
app.patch("/update/:userId", async (req, res) => {
  // const id = req.body.userId;
  const id = req.params.userId;
  const body = req.body;

  try {
    //do not allow to update the emailId
    const ALLOWED_UPDATES = [
      "firstName",
      "lastName",
      "password",
      "gender",
      "about",
      "photoUrl",
      "age",
      "skills",
    ];
    if (!Object.keys(body).every((k) => ALLOWED_UPDATES.includes(k))) {
      throw new Error("Update not allowed.");
    }
    const userUpdate = await User.findOneAndUpdate({ _id: id }, body, {
      returnDocument: "before",
      //re-run the schema validators on update
      runValidators: "true",
    });

    console.log("user before update is", userUpdate);
    res.send("user updated successfully.");
  } catch (err) {
    res.status(400).send("Error in updating the user : " + err.message);
  }
});

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
