const mongoose = require("mongoose")

const couponSchema = new mongoose.Schema(
    {
        users:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"users"
            },
        ],
        coupon_description:{
            type:String,
            required:true,
        },
        coupon_code:{
            type:String,
            required:true,
        },
        coupon_type:{
            type:String,
            required:true,
        },
        coupon_value:{
            type:Number,
            required:true,
        },
        expire_date:{
            type:Date,
            required:true,
        },
        minimum_amount:{
            type:Number,
            required:true,
        },        
    },
    {versionkey:false}
);

module.exports=mongoose.model("coupons",couponSchema)
