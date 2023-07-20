const multer = require("multer")
const  adminSchema  = require("../models/adminSchema")
const  productSchema  = require("../models/productModel")


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
    try {
      const productData = await productSchema.find({})

      if(productData){
        res.render('admin/products',{ message: "",data :productData})
        console.log(productData)
      }

    } catch(error) {
        res.send(error.message)
    }
    // res.render('admin/products',{message: "",})
}

const add_product = async(req,res) => {
    res.render('admin/add_products',{message: "",})
}

const add_product_post = async(req,res) => {
    productImages = []
    // console.log(req.files)
    req.files.forEach((file) => {
        productImages.push(file.filename);
      });

    const data={
        product_name:req.body.product_name,
        description:req.body.description,
        category:req.body.category,
        stock:req.body.stock,
        price:req.body.price,
        product_image:productImages,
        is_blocked:req.body.isBlocked == 'on'?true:false
    }
    // console.log(data)
    await productSchema.insertMany([data])
    res.redirect('/products');
    // res.render('admin/products',{message: "product created",})
}

const products_visibility = async(req,res) => {
    res.render('admin/products',{message: "hai",})
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
products,add_product,add_product_post,products_visibility,
categories,
user_profile}