const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { validateSignUpdata } = require("../utils/validator");
const jwt = require("jsonwebtoken");

//signup
router.post("/signup", async (req, res) => {
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

//Login
router.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      throw new Error("Invalid Credentials");
    }

    const validpassword = await bcrypt.compare(password, user.password);

    if (validpassword) {
      const token = await jwt.sign({ _id: user._id }, "Akshay@27");

      res.cookie("token", token);
      res.send("Login Successfull");
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
});

module.exports = router