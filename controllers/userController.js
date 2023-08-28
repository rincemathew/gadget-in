const  productSchema  = require("../models/productModel")
const  userSchema  = require("../models/userModel")
const transporter = require("../helpers/nodeMailer");
const userModel = require("../models/userModel");


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
        // await userSchema.insertMany([dataR]);  
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
        await userSchema.insertMany([this.dataR]); 
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
      
      next()
      }
    else{
      next()
    }    
  };


  const login = async (req, res) => {
    try {
        const userData = await userSchema.findOne({
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
        smartphone = await productSchema.find({category_slug:'smartphones',is_blocked:false}).limit(4)
        wearable = await productSchema.find({category_slug:'wearables',is_blocked:false}).limit(4)
        earwear = await productSchema.find({category_slug:'earwear',is_blocked:false}).limit(4)
    } catch(error) {
        res.send(error.message)
    }
    res.render('user/index',{session:res.locals.sessionValue, message: "", smartphones:smartphone, wearables:wearable,earwears:earwear})
}

const smartphones = async(req,res) => {
    let smartphone
    try {
        smartphone = await productSchema.find({category:'smartphones',is_blocked:false})
    } catch(error) {
        res.send(error.message)
    }
    res.render('user/category_view',{session:res.locals.sessionValue,message: "", data:smartphone,name:'Smartphones'})
}

const wearables = async(req,res) => {
    let wearable
    try {
        wearable = await productSchema.find({category:'wearables',is_blocked:false})
    } catch(error) {
        res.send(error.message)
    }
    res.render('user/category_view',{session:res.locals.sessionValue,name: 'Wearables', data:wearable})
}

const earwears = async(req,res) => {
    let earwear
    try {
        earwear = await productSchema.find({category:'earwear',is_blocked:false})
    } catch(error) {
        res.send(error.message)
    }
    res.render('user/category_view',{session:res.locals.sessionValue,data:earwear,name:'EarWear'})
}


const products = async(req,res,next) => {
  // console.log(req.query.id)
  try {
    product = await productSchema.findOne({_id:req.query.id,is_blocked:false});
    if(!product) {
      res.render('user/404',{session:res.locals.sessionValue})
    }
    related = await productSchema.find({is_blocked:false}).limit(4)
  } catch(error) {
      res.send(error.message)
  }
  res.render('user/product_details',{session:res.locals.sessionValue,data: product,related:related})
}

const user_logout = async (req, res) => {
  req.session.destroy()
  res.redirect("/login-register")
};

//404
const page404 = async (req, res) => {
  res.render("user/404", {session:res.locals.sessionValue,});
};

module.exports = {login_register,register,login,home_page,verify_otp,sessionValidation,sessionValidUser,smartphones,wearables,earwears,
  products,user_logout,page404
    }