const mongoose = require('mongoose')

const wishlistSchema = mongoose.Schema({
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
    }
    ]
},{versionkey:false})

module.exports = mongoose.model('wishlists',wishlistSchema)