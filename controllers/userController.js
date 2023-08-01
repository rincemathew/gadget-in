const  productSchema  = require("../models/productModel")
const  userSchema  = require("../models/userModel")
const transporter = require("../helpers/nodeMailer")


//login and register

const login_register = async (req, res) => {
    res.render("user/login_register", { message: "",popUp:false });
  };

const register = async (req, res) => {
    try {
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
            res.render("user/login_register",{ message: 'Failed to send OTP',popUp:false });
          } else {
            console.log('OTP sent: ', this.otpCode);
            // res.status(200).send({ message: 'OTP sent successfully' });
            res.render("user/login_register",{ message: 'OTP sent successfully',popUp:true });
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
        res.render("user/login_register",{ message: 'User Created successfully',popUp:false });
        // res.status(200).send({ message: 'Login successful' });
        
      } else {
        res.render("user/login_register",{ message: 'Invalid OTP',popUp:true });
        // res.status(401).send({ message: 'Invalid OTP' });
      }
      } catch (error) {
        res.send(error.message);
      }
  };

  const sessionValidation = async (req, res, next) => {
    // console.log(req.params)
    if(req.session.user_id) {
      res.locals.sessionValue = req.session.first_name
      next()
    } else{
      res.locals.sessionValue = ''
      next()
    }
    // res.render("user/login_register", { message: "" });
    
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
            res.render("user/login_register", { message: "user is blocked" });
          } else {
            res.render("user/login_register", { message: "invalid password " });
          }
        } else {
          res.render("user/login_register", { message: "User does not exist" });
        }
      } catch (error) {
        res.send(error.message);
      }
  };


//views


const home_page = async(req,res) => {
    let smartphone,wearable,earwear
    try {
        smartphone = await productSchema.find({category:'smartphones',is_blocked:false}).limit(4)
        wearable = await productSchema.find({category:'wearables',is_blocked:false}).limit(4)
        earwear = await productSchema.find({category:'earwear',is_blocked:false}).limit(4)
        // console.log(wearable+" hakds")
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


const products = async(req,res) => {
  // console.log(req.query.id)
  try {
    product = await productSchema.findOne({_id:req.query.id});
    related = await productSchema.find({}).limit(4)
  } catch(error) {
      res.send(error.message)
  }
  res.render('user/product_details',{data: product,related:related})
}

module.exports = {login_register,register,login,home_page,verify_otp,sessionValidation,smartphones,wearables,earwears,
  products
    }