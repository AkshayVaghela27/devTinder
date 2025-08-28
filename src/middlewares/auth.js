const jwt = require("jsonwebtoken");
const User = require("../models/user");

const UserAuth = async (req, res, next) => {
  try {
    const cookie = req.cookies;

    const { token } = cookie;

    if (!token) {
      throw new Error("Invalid token");
    }

    const decodemsg = jwt.verify(token,"Akshay@27")

    const {_id} = decodemsg

    const user = await User.findById(_id)

    req.user = user

    next()

  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
};

module.exports = {UserAuth}