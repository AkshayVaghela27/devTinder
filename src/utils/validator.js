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

const validateEditData = (req) => {

    const allowToEdit = ["age","skills","about","photourl"]

    const isallowToEdit = Object.keys(req.body).every((key) => allowToEdit.includes(key))

    return isallowToEdit;
}

module.exports = {validateSignUpdata,validateEditData}