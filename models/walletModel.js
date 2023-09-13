const mongoose = require("mongoose")

const walletSchema = mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        required:true,
    },
    balance:{
        type:Number,
        required:true,
    },
    
    order_details:[
        {
            order_id:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"orders",
            },
            message:{
                type:String,
            },
            amount:{
                type:Number,
            },
            date:{
                type:Date,
                default:Date.now,   
            },
            return:{
            type:Boolean,
            default:false,
            },
        },
    ],
})

module.exports = mongoose.model("wallets",walletSchema)