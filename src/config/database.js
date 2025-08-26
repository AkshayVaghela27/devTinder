const mongoose = require("mongoose")

const connectDB = async () => {
    await mongoose.connect("mongodb+srv://Akshay:Akshay27@cluster0.u2txi6f.mongodb.net/DevTinder")
}

module.exports = connectDB