const  productModel  = require("../models/productModel")
const  userModel  = require("../models/userModel")
const transporter = require("../helpers/nodeMailer");
const categoryModel = require("../models/categoryModel");
const addressModel = require("../models/addressModel");


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
    const userID = req.session.user_id
    try {
        addresses = await addressModel.findOne({userid:userID})
        console.log(addresses)
        // await cartModel.findOne({ userid: userID }).populate("products.productid");
        // res.status(200).send({addressList:addresses})
        res.render("user/address",{session:res.locals.sessionValue,data: addresses,});

    } catch(error) {
        res.status(200).send(error.message)
    }
}

const address_get = async(req,res) => {
    let addresses = ''
    const userID = req.session.user_id
    try {
        addresses = await addressModel.findOne({userid:userID})
        console.log(addresses)
        // await cartModel.findOne({ userid: userID }).populate("products.productid");
        res.status(200).send({addressList:addresses})
        // res.render("user/address",{session:res.locals.sessionValue,data: addresses,});

    } catch(error) {
        res.status(200).send(error.message)
    }
}

const address_add = async(req,res) => {
    const userID = req.session.user_id
    try {
        data = req.body
        // console.log(data)
        const addressHas = await addressModel.findOne({ userid: userID});
        if(addressHas) {
            await addressModel.findOneAndUpdate(
                { userid: userID },
                {
                  $push: { address: data },
                },
                { new: true }
              );
        } else {
            await addressModel.insertMany({
                userid: userID,
                address: [data],
              });
        }
        
        res.status(200).send({popUp:'Address added sucessfully'})
        // res.render("user/address",{session:res.locals.sessionValue,data: data,});

    } catch(error) {
        res.send(error.message)
    }
}
//not inplimented
const address_edit = async(req,res) => {
    try {
        data = ''
        res.render("user/address",{session:res.locals.sessionValue,data: data,});

    } catch(error) {
        res.send(error.message)
    }
}

const address_delete = async(req,res) => {
    const userID = req.session.user_id
    try {
        // deleteID = req.body
        console.log(req.body.unIDD +"iqwer")
        await addressModel.updateOne({ userid: userID }, 
            { $pull: { address: { _id: req.body.unIDD } } }
        );
        // addresses = await addressModel.findOne({userid:userID})
        // await cartModel.findOne({ userid: userID }).populate("products.productid");
        res.status(200).send({popUp:'address deleted sucessfully'})
        // res.render("user/address",{session:res.locals.sessionValue,data: addresses,});

    } catch(error) {
        res.status(200).send({popUp:error.message})
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

module.exports = {profile,profilePost,wishlist,address,address_get,address_add,address_edit,address_delete,orders}