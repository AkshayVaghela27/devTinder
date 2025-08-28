const mongoose = require("mongoose");
const validator = require("validator")
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minLength: 3,
      maxLength: 50,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
      validate(value){
        if(!validator.isEmail(value))
        {
            throw new Error("Enter proper email Id")
        }
    }
    },
    password: {
      type: String,
      required: true,
      validate(value){
        if(!validator.isStrongPassword(value))
        {
            throw new Error("Enter strong password")
        }
    }
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      lowercase: true,
      validate(value) {
        if (![male, female, other].includes(value)) {
          throw new Error("Gender is not proper");
        }
      },
    },
    about: {
      type: String,
      default: "This is about the user",
    },
    photourl: {
      type: String,
      default:
        "https://t4.ftcdn.net/jpg/02/44/43/69/360_F_244436923_vkMe10KKKiw5bjhZeRDT05moxWcPpdmb.jpg",
      validate(value){
        if(!validator.isURL(value))
        {
            throw new Error("Enter a url only")
        }
    }
    },
    skills: {
       type: [String]},
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
