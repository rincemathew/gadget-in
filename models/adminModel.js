const mongoose = require('mongoose')


const adminModel = mongoose.Schema({
    name: {
        type:String,
        required:true,
    },
    slug: {
        type:String,
        required:true,
    },
    email_id: {
        type:String,
        required:true,
    },
    password: {
        type:String,
        required:true,
    },
    
})

module.exports = mongoose.model('admins',adminModel)