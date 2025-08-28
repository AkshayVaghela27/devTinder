const express = require("express");
const router = express.Router();
const {UserAuth} = require("../middlewares/auth");

//get profile
router.get("/profile", UserAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send(user);
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
});

module.exports = router