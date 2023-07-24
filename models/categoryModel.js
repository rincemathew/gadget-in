const mongoose = require('mongoose')

const categorySchema = mongoose.Schema({
    category_name:{
        type:String,
        required:true
    },

    is_blocked:{
        type:Boolean,
        default:true
    }
})

module.exports = mongoose.model('category',categorySchema,'category')