const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
    product_name:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true
    },
    stock:{
        type:Number,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    product_image:{
        type:Array,
        required:true
    },
    is_blocked:{
        type:Boolean,
        default:false,
    }
})

module.exports = mongoose.model('products',productSchema)