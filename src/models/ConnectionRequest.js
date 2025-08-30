const mongoose = require("mongoose")

const ConnectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    status:{
        type: String,
        enum : {
            values: ["ignored","interested","rejected","accepted"],
            message : `{VALUE} is incorrect status type`
        },
        required: true
    }
},{
    timestamps: true
})

ConnectionRequestSchema.index({fromUserId:1 , toUserId:1})

ConnectionRequestSchema.pre("save", function(next){
    const connectionRequest = this;

    if(connectionRequest.fromUserId.equals(this.toUserId)){
        throw new Error("You can't send connection request to yourself")
    }
    next()
})

const ConnectionRequest = mongoose.model("ConnectionRequest",ConnectionRequestSchema)

module.exports = ConnectionRequest