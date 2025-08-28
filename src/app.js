const express = require("express");
const bcrypt = require("bcrypt");
const CookieParser = require("cookie-parser")
const jwt = require("jsonwebtoken")
const connectDB = require("./config/database");
const User = require("./models/user");
const {UserAuth} = require("./middlewares/auth")
const { validateSignUpdata } = require("./utils/validator");

const app = express();

app.use(express.json());
app.use(CookieParser())

//signup
app.post("/signup", async (req, res) => {
  try {
    //validate data
    validateSignUpdata(req);

    const { firstName, lastName, emailId, password } = req.body;

    //encrypt password
    const hashpassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashpassword,
    });
    await user.save();
    res.send("data added successfully");
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      throw new Error("Invalid Credentials");
    }

    const validpassword = await bcrypt.compare(password, user.password);

    if (validpassword) {

      const token = await jwt.sign({_id: user._id} , "Akshay@27")

      res.cookie("token",token)
      res.send("Login Successfull");
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
});

//get profile
app.get("/profile",UserAuth, async(req,res) => {

    try{

     const user = req.user

     res.send(user)

    }catch (err) {
    res.status(400).send("Error : " + err.message);
  }

})

//get user by id
app.get("/user", async (req, res) => {
  const emailId = req.body.emailId;
  try {
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      res.status(404).send("User not found");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

//Feed api get all users
app.get("/feed", async (req, res) => {
  try {
    const user = await User.find({});
    res.send(user);
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

//update user
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;

  const data = req.body;

  try {
    const allowUpdate = ["gender", "age", "skills", "photourl", "about"];

    const isupdateAllow = Object.keys(data).every((k) =>
      allowUpdate.includes(k)
    );

    if (!isupdateAllow) {
      throw new Error("Update not allow");
    }

    if (data?.skills && data.skills.length > 10) {
      throw new Error("Skills more than 10 not allow");
    }

    const user = await User.findByIdAndUpdate(userId, data, {
      runValidators: true,
    });
    res.send("user update successfully");
  } catch (err) {
    res.status(400).send("Something went wrong" + err.message);
  }
});

//delete user
app.delete("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  try {
    await User.findByIdAndDelete(userId);
    res.send("user delete successfully");
  } catch (err) {
    res.status(400).send("Error " + err.message);
  }
});

connectDB()
  .then(() => {
    console.log("Database connection successfully");
    app.listen(7777, () => {
      console.log("port running on 7777");
    });
  })
  .catch((err) => {
    console.error("Database not connected");
  });
