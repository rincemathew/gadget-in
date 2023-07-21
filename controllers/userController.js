const  productSchema  = require("../models/productModel")


const home_page = async(req,res) => {
    let smartphone,wearable,earwear
    try {
        smartphone = await productSchema.find({category:'smartphones'})
        wearable = await productSchema.find({category:'wearable'})
        earwear = await productSchema.find({category:'earwear'})
        console.log(smartphone)
    } catch(error) {
        res.send(error.message)
    }
    res.render('user/index',{message: "", smartphones:smartphone, wearables:wearable,earwears:earwear})
}


module.exports = {home_page,
    }