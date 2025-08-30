const express = require("express")
const router = express.Router()
const User = require("../models/user")
const ConnectionRequest = require("../models/ConnectionRequest")
const {UserAuth} = require("../middlewares/auth")

router.post("/request/send/:status/:toUserId" , UserAuth,
    async (req,res) => {

        try{
        const fromUserId = req.user._id
        const toUserId = req.params.toUserId
        const status = req.params.status

        const allowstatus = ["interested","ignored"]

        if(!allowstatus.includes(status)){
            throw new Error("Status is not valid")
        }

        const toUser = await User.findById(toUserId)

        if(!toUser){
            throw new Error("User not Found")
        }

        const existingrequest = await ConnectionRequest.findOne({
            $or:[
                {fromUserId,toUserId},
                {fromUserId:toUserId , toUserId:fromUserId}
            ]
        })

        if(existingrequest){
            throw new Error("Connection request is exits")
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId,toUserId,status
        })

        const data = await connectionRequest.save()

        res.send({message: req.user.firstName + " is " + status + " in You ",data})

        }catch(err){
            res.status(400).send("ERROR : " + err.message)
        }

    }
)

router.post("/request/review/:status/:requestId" , UserAuth , 
    async (req,res) => {
        try{
            const logginUser = req.user
            const {status,requestId} = req.params

            const allowstatus = ["accepted","rejected"]

            if(!allowstatus.includes(status)){
                throw new Error("Status is invalid")
            }

            const checkConnectionRequest = await ConnectionRequest.findOne({
                _id:requestId,
                toUserId:logginUser._id,
                status: "interested"
            })

            if(!checkConnectionRequest){
                throw new Error("Connection request not found")
            }
            checkConnectionRequest.status = status

            const data = await checkConnectionRequest.save()

            res.send({message:"Connection accepet successfully!!",data})
        }catch(err){
            res.status(400).send("Error : "+ err.message)
        }
    }
)

module.exports = router