const express = require("express");
const bcrypt = require("bcrypt")
const router = express.Router();
const { UserAuth } = require("../middlewares/auth");
const { validateEditData } = require("../utils/validator")

//get profile
router.get("/profile/view", UserAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send(user);
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
});

//edit profile
router.patch("/profile/edit", UserAuth, async (req, res) => {
  try {
    if (!validateEditData(req)) {
      throw new Error("Invalid Edit Request");
    }

    const loggedinuser = req.user;

    Object.keys(req.body).forEach((key) => (loggedinuser[key] = req.body[key]));

    await loggedinuser.save();

    res.json({
      message: `${loggedinuser.firstName} , your profile has been updated`,
      data: { loggedinuser },
    });
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

router.post("/profile/password", UserAuth, async (req, res) => {
  const user = req.user;
  try {
    const { currentPassword, newPassword } = req.body;
    const compared = await bcrypt.compare(currentPassword,user.password)
    if(!compared){
        throw new Error("Invalid current password")
    }

    const hashpassword = await bcrypt.hash(newPassword,10)

    user.password = hashpassword

    await user.save()

    res.send("Update password successfully!!!")

  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

module.exports = router;
