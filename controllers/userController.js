const  productSchema  = require("../models/productModel")


const home_page = async(req,res) => {
    let smartphone,wearable,earwear
    try {
        smartphone = await productSchema.find({category:'smartphones',is_blocked:false}).limit(4)
        wearable = await productSchema.find({category:'wearables',is_blocked:false}).limit(4)
        earwear = await productSchema.find({category:'earwear',is_blocked:false}).limit(4)
        console.log(wearable+" hakds")
    } catch(error) {
        res.send(error.message)
    }
    res.render('user/index',{message: "", smartphones:smartphone, wearables:wearable,earwears:earwear})
}

const smartphones = async(req,res) => {
    let smartphone
    try {
        smartphone = await productSchema.find({category:'smartphones',is_blocked:false})
    } catch(error) {
        res.send(error.message)
    }
    res.render('user/category_view',{message: "", data:smartphone,name:'Smartphones'})
}

const wearables = async(req,res) => {
    let wearable
    try {
        wearable = await productSchema.find({category:'wearables',is_blocked:false})
    } catch(error) {
        res.send(error.message)
    }
    res.render('user/category_view',{name: 'Wearables', data:wearable})
}

const earwears = async(req,res) => {
    let earwear
    try {
        earwear = await productSchema.find({category:'earwear',is_blocked:false})
    } catch(error) {
        res.send(error.message)
    }
    res.render('user/category_view',{data:earwear,name:'EarWear'})
}


module.exports = {home_page,smartphones,wearables,earwears
    }