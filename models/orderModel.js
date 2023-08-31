const mongoose = require('mongoose')

const orderSchema = mongoose.Schema({
    userid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        required:true,
    },
    products:[
    {
      productid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"products",
        required:true,
      },
      quantity:{
        type:Number,
        required:true
      },
      status:{
        type:String,
        required:true,
    },
    date:{
        type:Date,
        default:Date.now
    },
    address:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"addresses",
        required:true,
    },
    }
    ]
},{versionkey:false})

module.exports = mongoose.model('orders',orderSchema)