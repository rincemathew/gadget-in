const  productModel  = require("../models/productModel")
const  userModel  = require("../models/userModel")
const transporter = require("../helpers/nodeMailer");
// const userModel = require("../models/userModel");
const categoryModel = require("../models/categoryModel");
const bannerModel = require("../models/bannerModel");


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
      if(checker) {
        res.render("user/login_register",{session:false, message: 'User With this email exist',popUp:false });
      }
        this.dataR = {first_name:req.body.name,
            email_id:req.body.email,
            password:req.body.password
        }
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
            // res.status(500).send({ message: 'Failed to send OTP' });
            res.render("user/login_register",{session:false, message: 'Failed to send OTP',popUp:false });
          } else {
            console.log('OTP sent: ', this.otpCode);
            // res.status(200).send({ message: 'OTP sent successfully' });
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
      console.log(otp);
        console.log(this.otpCode);
      // Verify the OTP code
      // In this example, we are using a hardcoded value for demonstration purposes only.
      // In a real application, you should compare the OTP to the one generated in the previous step.
      
      if (otp == this.otpCode && otp!=0) {
        // print("otp");
        // print("otp"+otp);
        // print(this.otpCode+"this otp");
        console.log(otp);
        console.log(this.otpCode);
        await userModel.insertMany([this.dataR]); 
        res.render("user/login_register",{session:false, message: 'User Created successfully',popUp:false });
        // res.status(200).send({ message: 'Login successful' });
        
      } else {
        res.render("user/login_register",{ session:false,message: 'Invalid OTP',popUp:true });
        // res.status(401).send({ message: 'Invalid OTP' });
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
      res.render("user/login_register", { session:false,message: "Login to see your accoumt",popUp:false });
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
          // console.log(userData,req.body.password)
          if (userData.password === req.body.password && userData.is_blocked === true) {
            req.session.user_id=userData._id
            res.redirect("/");
          } else if (userData.password === req.body.password && userData.is_blocked === false){
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
      dataV = await productModel.find({category:cateID._id,is_blocked:false})
      console.log(cateID + "gfg")
  } catch(error) {
      res.send(error.message)
  }
  res.render('user/category_view',{session:res.locals.sessionValue,data:dataV,name:''})
}

const user_logout = async (req, res) => {
  req.session.destroy()
  res.redirect("/login-register")
};

//search box

const search_box = async(req, res) => {
  console.log('ffffffffffffffffffffffffffffffffffff')
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

const search_box_click = async(req, res) => {
  try {
    // const productList = await productModel.find({$text: {$search: searchString}}).limit(7)
  }catch(error) {

  }
}

//404
const page404 = async (req, res) => {
  res.render("user/404", {session:res.locals.sessionValue,});
};

module.exports = {login_register,register,login,home_page,verify_otp,sessionValidation,sessionValidUser,ajaxSessionValidUser,
  products,categories_view,user_logout,search_box,search_box_click,page404
    }