const  productModel  = require("../models/productModel")
const  userModel  = require("../models/userModel")
const categoryModel = require("../models/categoryModel");
const cartModel = require("../models/cartModel");
const addressModel = require("../models/addressModel");
const orderModel = require("../models/orderModel");
const mongoose = require("mongoose");


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
  
  
  const checkout_post = async(req,res) => {
    if(req.body.payment === 'cod'){
      cod(req,res)
    } else {
      online_payment(req,res);
    }
  }

  const online_payment = async(req,res,payment) =>{
    try{

    }catch(error) {
      console.log(error.message)
    }
  }

  const cod = async(req,res) => {
    try {
      const userID = req.session.user_id
      const address = req.body.address
      const payment = req.body.payment == 'cod'? 'Cash on Delevery' : 'Online Payment'
      const orderHas = await orderModel.findOne({ userid: userID});
      const cartdata = await cartModel.findOne({ userid: userID }).populate("products.productid");
      let products = []
      for(i=0;i<cartdata.products.length;i++) {
        products[i] = {product_id: cartdata.products[i].productid._id, quantity: cartdata.products[i].quantity,status:'out for delivery',delivery_date:""}
       }

      if(orderHas) {
        await orderModel.findOneAndUpdate(
                    { user_id: userID },
                    {
                      $push: { orders: { total_amount: 1000, coupon_type: "",coupon_amount:"",payment_method:payment,reason:"",address:address, products:products } },
                    },
                    { new: true }
                  );
      } else {
        await orderModel.insertMany({
          user_id: userID,
                    orders: [{ total_amount: 100, coupon_type: "",coupon_amount:"",payment_method:payment,reason:"",address:address, products:products }],
                  });
      }
      
      // for(i=0;i<cartdata.products.length;i++) {
      //   const orderHas = await orderModel.findOne({ userid: userID});
      //   if(orderHas) {
      //       await orderModel.findOneAndUpdate(
      //           { userid: userID },
      //           {
      //             $push: { products: { productid: cartdata.products[i].productid._id, quantity: cartdata.products[i].quantity,status:'out for delivery',address:address } },
      //           },
      //           { new: true }
      //         );
      //   } else {
      //       await orderModel.insertMany({
      //           userid: userID,
      //           products: [{ productid: cartdata.products[i].productid._id, quantity: cartdata.products[i].quantity,status:'out for delivery',address:address }],
      //         });
      //   }
      //   const stockMinus = await productModel.findOne({ _id: cartdata.products[i].productid._id },);
      //   await productModel.updateOne({_id:cartdata.products[i].productid._id},{$set:{stock:stockMinus.stock - cartdata.products[i].quantity}});
      //   await cartModel.updateOne({ userid: userID }, { $pull: { products: { productid: cartdata.products[i].productid._id } } });
      // }
      res.redirect("/account/orders");  
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