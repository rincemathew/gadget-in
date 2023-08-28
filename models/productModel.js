const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
    product_brand_name:{
        type:String,
        required:true,
    },
    product_name:{
        type:String,
        required:true,
    },
    product_slug:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        default:'uncategorised'
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
    },
    is_deleted:{
        type:Boolean,
        default:false,
    },
    features:{
        type:Boolean,
        required:false,
    }
})

module.exports = mongoose.model('products',productSchema)