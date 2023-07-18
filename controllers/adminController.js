const  adminSchema  = require("../models/adminSchema")


////LOGIN
const admin_login = async(req,res) => {
    res.render('admin/index',{message: "",})
}

const login_admin = async(req,res) => {
    try {
        const admindata= await adminSchema.findOne({admin_name:req.body.username})
        console.log(admindata.name);

      if(admindata){
        // console.log(userdata.username);
        if(admindata.admin_password===req.body.password){
            // req.session.admin_id=admindata.username
            res.render('admin/dashboard',)
        }else{
            res.render('admin/index',{message: "invalid password",})
        }
      }else{
        // console.log("error");
        res.render('admin/index',{ message: "Admin does not exist",})
      }

    } catch(error) {
        res.send(error.message)
    }
}


////DASHBOARD
const dashboard = async(req,res) => {
    res.render('admin/dashboard',{message: "",})
}


//PRODUCTS
const products = async(req,res) => {
    res.render('admin/products',{message: "",})
}

const add_product = async(req,res) => {
    res.render('admin/add_products',{message: "",})
}

//CATEGORIES
const categories = async(req,res) => {
    res.render('admin/categories',{message: "",})
}


//USER PROFILE
const user_profile = async(req,res) => {
    res.render('admin/user_profile',{message: "",})
}


module.exports = {admin_login,login_admin,
dashboard,
products,add_product,
categories,
user_profile}