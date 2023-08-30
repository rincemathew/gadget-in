const mongoose = require('mongoose')

const addressSchema = mongoose.Schema({
    userid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        required:true,
    },
    address:[
    {
      uniqueid:{
            type:String,
            required:true
          }, 
      name:{
        type:String,
        required:true
      },
      mobile_no:{
        type:Number,
        required:true
      },
      pin_code:{
        type:Number,
        required:true
      },
      state:{
        type:String,
        required:true
      },
      full_address:{
        type:String,
        required:true
      },
      defultAddress:{
        type:Boolean,
        default:false
      },
    }
    ]
},{versionkey:false})

module.exports = mongoose.model('addresses',addressSchema)