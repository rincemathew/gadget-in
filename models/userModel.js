const mongoose = require('mongoose')


const UserSchema =new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
        
    },
    last_name: {
        type: String,
        
    },
    email_id: {
        type:String,
        required:true
    },
    password: {
        type: String,
        required: true
    },
    mobile:{
        type:Number
    },
    birth_date:{
        type:Date
    },
    image:{
        type:String,
        required: false,
        
    },
    is_blocked: {
        type:Boolean,
        default:true
    },

})

module.exports = mongoose.model("users",UserSchema)
 
 