const  productModel  = require("../models/productModel")
const  userModel  = require("../models/userModel")
const transporter = require("../helpers/nodeMailer");
// const userModel = require("../models/userModel");
const categoryModel = require("../models/categoryModel");
const bannerModel = require("../models/bannerModel");

const bcrypt = require('bcrypt');
const saltRounds = 10;


//login and register

const login_register = async (req, res) => {
  if(req.session.user_id) {
    res.redirect("/");
  } else {
    res.render("user/login_register", { session:false,message: "",popUp:false });
  }
  };

const register = async (req, res) => {
    try {

      checker = await userModel.findOne({email_id:req.body.email})
      if(req.body.password !== req.body.forgetpassword) {
        res.render("user/login_register",{session:false, message: 'Password MissMatch',popUp:false });
      }
      // if(checker) {
      //   res.render("user/login_register",{session:false, message: 'User With this email exist',popUp:false });
      // }
      // const hashed = bcrypt.hash(myPlaintextPassword, saltRounds, function(err, hash) {
      // });
        this.Tfirstname = req.body.name,
        this.Temailid = req.body.email
        this.Tpassword = req.body.password
        this.otpCode = Math.floor(100000 + Math.random() * 900000);
        const mailOptions = {
          from: "rincemathew.m@gmail.com",
          to: req.body.email,
          subject: "LogIn OTP",
          text: `Your OTP code is ${this.otpCode}.`,
        };
      
        transporter.sendMail(mailOptions, (error, _info) => {
          if (error) {
            console.error('Error sending email: ', error);
            res.render("user/login_register",{session:false, message: 'Failed to send OTP',popUp:false });
          } else {
            console.log('OTP sent: ', this.otpCode);
            res.render("user/login_register",{ session:false,message: 'OTP sent successfully',popUp:true });
          }
        });
        // await userModel.insertMany([dataR]);  
      } catch (error) {
        res.send(error.message);
      }
  };

  const verify_otp = async (req, res) => {
    try {
      const { otp } = req.body;
      if (otp == this.otpCode && otp!=0) {
        console.log(otp);
        console.log(this.otpCode);
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(this.Tpassword, salt);
        await userModel.insertMany({first_name:this.Tfirstname,email_id:this.Temailid,password:hash}); 
        res.render("user/login_register",{session:false, message: 'User Created successfully',popUp:false });
        
      } else {
        res.render("user/login_register",{ session:false,message: 'Invalid OTP',popUp:true });
      }
      } catch (error) {
        res.send(error.message);
      }
  };

  const sessionValidation = async (req, res, next) => {
    if(req.session.user_id) {
      res.locals.sessionValue = true
      valid = await userModel.findOne({_id:req.session.user_id})
      if(!valid.is_blocked) {
      res.locals.sessionValue = false
      req.session.destroy()
      }
      next()
    } else{
      res.locals.sessionValue = false
      next()
    }    
  };

  const sessionValidUser = async (req, res, next) => {
    if(req.session.user_id) {
      console.log('session')
      res.locals.sessionValue = true
      valid = await userModel.findOne({_id:req.session.user_id})
      if(!valid.is_blocked) {
      res.locals.sessionValue = false
      req.session.destroy()
      }
      next()
    } else{
      console.log('nosession')
      res.locals.sessionValue = false
      res.render("user/login_register", { session:false,message: "Login to see your account",popUp:false });
    }    
  };

  const ajaxSessionValidUser = async (req, res, next) => {
    if(req.session.user_id) {
      console.log('session')
      res.locals.sessionValue = true
      valid = await userModel.findOne({_id:req.session.user_id})
      // if(!valid.is_blocked) {
      // res.locals.sessionValue = false
      // req.session.destroy()
      // }
      next()
    } else{
      console.log('nosession')
      res.locals.sessionValue = false
      res.send({ message: "nosession",popUp:"" });
      // res.json({status: "Success", redirect: 'login-register'});
    }    
  };


  const login = async (req, res) => {
    try {
        const userData = await userModel.findOne({
          email_id: req.body.email,
        });    
        if (userData) {
          // console.log(req.body.password,userData.password)
          const pass = await bcrypt.compare(req.body.password, userData.password);
          // console.log(password)
          if (pass && userData.is_blocked === true) {
            req.session.user_id=userData._id
            res.redirect("/");
          } else if (pass && userData.is_blocked === false){
            res.render("user/login_register", { session:false,message: "user is blocked",popUp:false });
          } else {
            res.render("user/login_register", { session:false,message: "invalid password ",popUp:false });
          }
        } else {
          res.render("user/login_register", { session:false,message: "User does not exist",popUp:false });
        }
      } catch (error) {
        res.send(error.message);
      }
  };


//views


const home_page = async(req,res) => {
    let smartphone,wearable,earwear
    try {
      productCategories = await categoryModel.find({is_blocked:false})
        smartphone = await productModel.find({category:'64ec75d49a45f8abcc481e87',is_blocked:false}).limit(4)
        wearable = await productModel.find({category:'64ec98a6ab3a9b83ef2d66d2',is_blocked:false}).limit(4)
        earwear = await productModel.find({category:'64ec764fab3a9b83ef2d66c5',is_blocked:false}).limit(4)
        banner = await bannerModel.find({}).limit(5)
        // console.log(earwear+'earwear')
    } catch(error) {
        res.send(error.message)
    }
    res.render('user/index',{session:res.locals.sessionValue, message: "", smartphones:smartphone, wearables:wearable,earwears:earwear,categories:productCategories,banners:banner})
}


const products = async(req,res,next) => {
  // console.log(req.query.id)
  try {
    product = await productModel.findOne({_id:req.query.id,is_blocked:false});
    if(!product) {
      res.render('user/404',{session:res.locals.sessionValue})
    }
    relatedV = await productModel.find({is_blocked:false}).limit(3)
    console.log(relatedV +"fg")
    res.render('user/product_details',{session:res.locals.sessionValue,data:product,related:relatedV})
  } catch(error) {
      res.send(error.message)
  }
  
}

const categories_view = async(req,res) => {
  let dataV
  try {
    cateID = await categoryModel.findOne({category_slug:req.params.slug})
    console.log(cateID,req.params.slug+'ddddddddddd')
      // dataV = await productModel.find({category:cateID._id,is_blocked:false})
  } catch(error) {
      res.send(error.message)
  }
  res.render('user/category_view',{session:res.locals.sessionValue,cateId:cateID._id,name:''})
}

const categoriesDisplayItems = async(req,res) => {
  let dataV
  let {cateID,fPrice,fBrand,sName,sPrice,filterItem} = req.body
  fPrice = fPrice.split('-')
  if(fBrand=='all') {
    fBrand = { $exists: true }
  }
  console.log(fBrand,sName,sPrice)
  try {
    // cateID = await categoryModel.findOne({category_slug:req.params.slug})
    if(filterItem) {
      dataV = await productModel.find({category:cateID,is_blocked:false,price: { $gte: Number(fPrice[0]), $lte: Number(fPrice[1]) },product_brand_name: fBrand,}).sort({ product_brand_name: sName });
    } else {
      dataV = await productModel.find({category:cateID,is_blocked:false,price: { $gte: Number(fPrice[0]), $lte: Number(fPrice[1]) },product_brand_name: fBrand,}).sort({ price: sPrice });
    }
      console.log(dataV)
  } catch(error) {
      res.send(error.message)
  }
  res.send({data:dataV})
}

const user_logout = async (req, res) => {
  req.session.destroy()
  res.redirect("/login-register")
};

//search box

const search_box = async(req, res) => {
  const {value} = req.params
  console.log(value)
  try {
    // const productList = await productModel.find({$product_slug: {$search: value}}).limit(7)
    const productList = await productModel.find({ "product_slug": { "$regex": value, "$options": "i" } }).limit(7)
    console.log(productList)
    res.send({message:'',productLists:productList})
  }catch(error) {
    res.send({message:error.message})
  }
}


//404
const page404 = async (req, res) => {
  res.render("user/404", {session:res.locals.sessionValue,});
};

module.exports = {login_register,register,login,home_page,verify_otp,sessionValidation,sessionValidUser,ajaxSessionValidUser,
  products,categories_view,categoriesDisplayItems,user_logout,search_box,page404
    }