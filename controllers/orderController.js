const  productModel  = require("../models/productModel")
const  userModel  = require("../models/userModel")
const categoryModel = require("../models/categoryModel");
const cartModel = require("../models/cartModel");
const addressModel = require("../models/addressModel");
const orderModel = require("../models/orderModel");
const mongoose = require("mongoose");

const Razorpay = require('razorpay'); 


const razorpayInstance = new Razorpay({
  key_id: RAZORPAY_ID_KEY = process.env,
  key_secret: RAZORPAY_SECRET_KEY = process.env
});


const checkout = async(req,res) => {
    try {
      let total = 0;
        const userID = req.session.user_id
        const cartdataq = await cartModel.findOne({ userid: userID })
        if(!cartdataq || cartdataq.products.length == 0) {
          return res.render("user/cart",{session:res.locals.sessionValue,message:"Add some products to the cart"});
        }
        const cartdata = await cartModel.findOne({ userid: userID }).populate("products.productid");
        const addresses = await addressModel.findOne({userid:userID})
        if(!addresses || addresses.address.length == 0) {
          return res.render("user/address",{session:res.locals.sessionValue,message:"Add an address to continue...."});
        }
        console.log(cartdata)
        for(i=0;i<cartdata.products.length;i++) {
          total = total + (cartdata.products[i].productid.price * cartdata.products[i].quantity)
        }
        res.render("user/check_out",{session:res.locals.sessionValue,addresss:addresses,cart:cartdata,total:total,message:""});
  
    } catch(error) {
        res.send(error.message)
    }
  }
  
  
  const ssss = async(req,res) => {
    try{
      

    }catch(error) {
      res.send({message:error.message})
    }
    // if(req.body.payment === 'cod'){
    //   cod(req,res)
    // } else {
    //   online_payment(req,res);
    // }
  }

  const online_payment = async(req,res) =>{
    try{
      

    }catch(error) {
      console.log(error.message)
    }
  }

  const checkout_post = async(req,res) => {
    try {
      const userID = req.session.user_id
      console.log(req.body)
      const {total_amount, coupon_type, coupon_amount, payment_method, wallet_amount, offer, address} = req.body
      console.log(total_amount,coupon_amount)
      const orderHas = await orderModel.findOne({ userid: userID});
      console.log('aaaaaa')
      const cartdata = await cartModel.findOne({ userid: userID }).populate("products.productid");
      let products = []
      console.log('bbbbbb')
      for(i=0;i<cartdata.products.length;i++) {
        products[i] = {product_id: cartdata.products[i].productid._id, quantity: cartdata.products[i].quantity,status:'out for delivery',delivery_date:""}
       }
       console.log('cccccc')
      if(orderHas) {
        console.log('fsdvdfvdf')
        await orderModel.findOneAndUpdate(
                    { user_id: userID },
                    {
                      $push: { orders: { total_amount: total_amount, coupon_type: coupon_type,coupon_amount:coupon_amount,payment_method:payment_method,wallet_amount:wallet_amount,offer:offer,reason:"",address:address, products:products } },
                    },
                    { new: true }
                  );
      } else {
        await orderModel.insertMany({
          user_id: userID,
                    orders: [{ total_amount: total_amount, coupon_type: coupon_type,coupon_amount:coupon_amount,payment_method:payment_method,wallet_amount:wallet_amount,offer:offer,reason:"",address:address, products:products }],
                  });
      }
      console.log('dddddd')
      
      res.send({message:"sucess",popUp:'sucess'}) 
  } catch(error) {
      res.send(error.message)
  }
  }
  
  
  
  
  
  //admin Side
  const order_admin_controller = async(req,res) => {
    
    try {
      const order = await orderModel.find({}).populate("orders").populate("userid").lean().exec();
      console.log(order)
      res.render("admin/order", { message: "",order:order });
    } catch (error) {
      res.status(200).send({ popUp: error.message,message:"" });
    }
  }
  
  const order_delivery_confirm = async(req,res) => {
    ids = req.body
    console.log(ids)
    try {
      await orderModel.updateOne(
        { userid: new mongoose.Types.ObjectId(ids.user) },
        {
          $set: {
            "products.$[product].status": "delivered",
          },
        },
        {
          arrayFilters: [
            { "product.productid": new mongoose.Types.ObjectId(ids.product) },
          ],
        }
      );
      res.send({message:"",popUp:"order delivery confirmed"})
    } catch (error) {
      res.status(200).send({ popUp: error.message,message:"" });
    }
  }


  module.exports = {
    checkout,checkout_post,order_admin_controller,order_delivery_confirm
}