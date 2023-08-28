const mongoose = require('mongoose')

const categorySchema = mongoose.Schema({
    category_name:{
        type:String,
        required:true
    },
    category_slug:{
        type:String,
        required:true
    },
    is_blocked:{
        type:Boolean,
        default:false
    },
    category_image:{
        type:String,
        default:''
    },
    is_deleted:{
        type:Boolean,
        default:false
    }
})

module.exports = mongoose.model('categories',categorySchema,)