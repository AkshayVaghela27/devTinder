const validator = require("validator")

const validateSignUpdata = (req) => {
    const {firstName,lastName,emailId,password} = req.body

    if(!firstName || !lastName){
        throw new Error("Enter a valid Name")
    }
    if(!validator.isEmail(emailId)){
        throw new Error("Enter a valid Email")
    }
    if(!validator.isStrongPassword(password)){
        throw new Error("Enter a strong password")
    }
}

module.exports = {validateSignUpdata}