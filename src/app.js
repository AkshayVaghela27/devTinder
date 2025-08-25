const express = require("express")

const app = express()

app.use('/',(req,res)=> {
    res.send("hello Devs")
})

app.listen(7777 , () => {
    console.log("port running on 7777")
})