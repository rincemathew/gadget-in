const  productSchema  = require("../models/productModel")
const  userSchema  = require("../models/userModel")


//login and register

const login_register = async (req, res) => {
    res.render("user/login_register", { message: "" });
  };

const register = async (req, res) => {
    try {
        data = {first_name:req.body.name,
            email_id:req.body.email,
            password:req.body.password

        }
        await userSchema.insertMany([data]);  
        res.redirect("/login-register");
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
  console.log(related)
  res.render('user/product_details',{data: product,related:related})
}

module.exports = {login_register,register,login,home_page,sessionValidation,smartphones,wearables,earwears,
  products
    }