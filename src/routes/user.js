const express = require("express")
const router = express.Router()
const {UserAuth} = require("../middlewares/auth")
const ConnectionRequest = require("../models/ConnectionRequest")
const User = require("../models/user")

const USER_SAFE_DATA = "firstName lastName photourl about gender age skills"

router.get("/user/request/received" , UserAuth,
    async(req,res) => {
        try{

            const logginUser = req.user;
            const connectionRequest = await ConnectionRequest.find({
                toUserId:logginUser._id,
                status: "interested"
            }).populate("fromUserId",
                USER_SAFE_DATA
            )
            res.send({message:"Connection request you received" , data:{connectionRequest}})
        }catch(err){
            res.status(400).send("ERROR : " + err.message)
        }
    }
)

router.get("/user/connections" , UserAuth ,
    async(req,res) => {

        try{

            const logginUser = req.user

            const connectionRequest = await ConnectionRequest.find({
                $or:[
                    {fromUserId: logginUser._id , status:"accepted"},
                    {toUserId: logginUser._id , status:"accepted"}
                ]
            }).populate("fromUserId",USER_SAFE_DATA).populate("toUserId",USER_SAFE_DATA)

            const data = connectionRequest.map(row =>{
                if(row.fromUserId._id.toString() === logginUser._id.toString()){
                    return row.toUserId
                }
                return row.fromUserId
            })

            res.send({message:"Your Connection are : ",data})

        }catch(err){
            res.status(400).send("ERROR : " + err.message)
        }
    }
)

router.get("/feed",UserAuth,
    async(req,res) => {
        try{

            const logginUser = req.user
            let limit = req.query.limit || 10;
            let page = req.query.page || 1;
            limit = limit>50 ? 50 : limit
            const skip = (page-1)*limit

            const connectionRequest = await ConnectionRequest.find({
                $or:[{fromUserId:logginUser._id} , {toUserId:logginUser._id}]
            }).select("fromUserId toUserId");

            const hideUserFromFeed = new Set()

            connectionRequest.forEach((req) => {
                hideUserFromFeed.add(req.fromUserId.toString())
                hideUserFromFeed.add(req.toUserId.toString())
            })

            const user = await User.find({
                $and:[
                    { _id : {$nin: Array.from(hideUserFromFeed)}},
                    { _id : {$ne: logginUser._id}}
                ]
            }).select(USER_SAFE_DATA).skip(skip).limit(limit)

            res.send(user)

        }catch(err){
            res.status(400).send("ERROR : " + err.message)
        }
    }
)

module.exports = router