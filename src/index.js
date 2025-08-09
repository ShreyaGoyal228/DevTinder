const express = require("express");

const app = express();
const connectDb = require("./config/database");
const User = require("./models/user");

app.use(express.json());

//signup api
app.post("/signup", async (req, res) => {
  const data = req.body;

  // we are creating the new instance of model User
  const user = new User(data);
  try {
    //on saving a new document was created into the user collection in database
    await user.save();
    res.send("User added successfully!");
  } catch (err) {
    res.status(500).send("Error in adding the user : ", err.message);
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
    console.log("Error in fetching the users :", err.message);
  }
});

//update user api
app.put("/update", async (req, res) => {
  const emailId = req.body.emailId;

  try {
    const userUpdate = await User.findOneAndUpdate(
      { emailId: emailId },
      { firstName: "Anmolllll" },
      { returnDocument: "before" }
    );
    console.log("user before update is", userUpdate);
    res.send("user updated successfully.");
  } catch (err) {
    console.log("Error in fetching the users :", err.message);
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
