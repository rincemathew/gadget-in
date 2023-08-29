const mongoose = require('mongoose')

const cartSchema = mongoose.Schema({
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
    }
    ]
},{versionkey:false})

module.exports = mongoose.model('carts',cartSchema)