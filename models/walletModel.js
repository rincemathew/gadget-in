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
            id_product:{
                type:String,
            },
            status:{
                type:String,
            },
            amount:{
                type:Number,
            },
            date:{
                type:Date,
                default:Date.now,   
            },
        },
    ],
})

module.exports = mongoose.model("wallets",walletSchema)