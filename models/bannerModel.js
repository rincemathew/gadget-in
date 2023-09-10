const mongoose = require('mongoose')

const bannerSchema = mongoose.Schema({
    banner_heading:{
        type:String,
        required:true
    },
    banner_slug:{
        type:String,
        required:true
    },
    banner_description:{
        type:String,
        required:true
    },
    banner_url:{
        type:String,
        required:true
    },
    is_blocked:{
        type:Boolean,
        default:false
    },
    banner_image:{
        type:String,
        required:true
    },
})

module.exports = mongoose.model('banners',bannerSchema,)