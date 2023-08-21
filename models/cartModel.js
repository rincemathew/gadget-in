const mongoose = require('mongoose')

const cartSchema = mongoose.Schema({
    userid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Users",
        required:true,
    },
    products:[
    {
      productid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Products",
        required:true,
      },
      quantity:{
        type:Number,
        required:true
      },
    }
    ]
},{versionkey:false})

module.exports = mongoose.model('cart-details',cartSchema)