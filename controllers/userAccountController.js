const  productModel  = require("../models/productModel")
const  userModel  = require("../models/userModel")
const transporter = require("../helpers/nodeMailer");
const categoryModel = require("../models/categoryModel");


const profile = async(req,res) => {
    const userID = req.session.user_id
    try {
        profileItem = await userModel.findOne({_id:userID})
        res.render("user/profile",{session:res.locals.sessionValue,data: profileItem,});

    } catch(error) {
        res.send(error.message)
    }
}

const profilePost = async(req,res) => {

    console.log(req.body.birth_date + ' dssdsdsdsdsd')
    try {
        await userModel.updateOne({_id:req.session.user_id},{$set:{first_name:req.body.first_name,
            last_name:req.body.last_name,email_id:req.body.email_id,mobile:req.body.mobile,birth_date:req.body.birth_date,}});
            res.redirect("/account/profile")

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

module.exports = {profile,profilePost,wishlist,address,orders}