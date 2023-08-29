const  productModel  = require("../models/productModel")
const  userModel  = require("../models/userModel")
const transporter = require("../helpers/nodeMailer");
const categoryModel = require("../models/categoryModel");


const profile = async(req,res) => {
    try {
        data = ''
        res.render("user/profile",{session:res.locals.sessionValue,data: data,});

    } catch(error) {
        res.send(error.message)
    }
}

const wishlist = async(req,res) => {
    try {
        data = ''
        res.render("user/wishlist",{session:res.locals.sessionValue,data: data,});

    } catch(error) {
        res.send(error.message)
    }
}

const address = async(req,res) => {
    try {
        data = ''
        res.render("user/address",{session:res.locals.sessionValue,data: data,});

    } catch(error) {
        res.send(error.message)
    }
}

const orders = async(req,res) => {
    try {
        data = ''
        res.render("user/order",{session:res.locals.sessionValue,data: data,});

    } catch(error) {
        res.send(error.message)
    }
}

module.exports = {profile,wishlist,address,orders}