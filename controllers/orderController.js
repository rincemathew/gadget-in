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
        console.log('1111111111111111111141111111')
        const cartdataq = await cartModel.findOne({ userid: userID })
        console.log('1111111111111111111111111111')
        if(!cartdataq || cartdataq.products.length == 0) {
          console.log('333333333333333333')
          return res.render("user/cart",{session:res.locals.sessionValue,message:"add some products to the cart"});
        }
        console.log('22222222222222222')
        const cartdata = await cartModel.findOne({ userid: userID }).populate("products.productid");
        const addresses = await addressModel.findOne({userid:userID})
        // if(!cartdata || !cartdata.products.length == 0) {
        //   return res.render("user/cart",{message:"add some products to the cart"});
        // }
        if(!addresses || addresses.address.length == 0) {
          return res.render("user/address",{session:res.locals.sessionValue,message:"add some products to the cart"});
        }
        console.log(cartdata)
        for(i=0;i<cartdata.products.length;i++) {
          total = total + (cartdata.products[i].productid.price * cartdata.products[i].quantity)
        }
        console.log(cartdata.products[0].productid.price+"product iidddddd")
        res.render("user/check_out",{session:res.locals.sessionValue,addresss:addresses,cart:cartdata,total:total,message:""});
  
    } catch(error) {
        res.send(error.message)
    }
  }
  
  
  const checkout_post = async(req,res) => {
    try {
        const userID = req.session.user_id
        const address = req.body.address
        console.log(address)
        const cartdata = await cartModel.findOne({ userid: userID }).populate("products.productid");
        for(i=0;i<cartdata.products.length;i++) {
          const orderHas = await orderModel.findOne({ userid: userID});
          if(orderHas) {
              await orderModel.findOneAndUpdate(
                  { userid: userID },
                  {
                    $push: { products: { productid: cartdata.products[i].productid._id, quantity: cartdata.products[i].quantity,status:'out for delivery',address:address } },
                  },
                  { new: true }
                );
          } else {
              await orderModel.insertMany({
                  userid: userID,
                  products: [{ productid: cartdata.products[i].productid._id, quantity: cartdata.products[i].quantity,status:'out for delivery',address:address }],
                });
          }
          const stockMinus = await productModel.findOne({ _id: cartdata.products[i].productid._id },);
          await productModel.updateOne({_id:cartdata.products[i].productid._id},{$set:{stock:stockMinus.stock - cartdata.products[i].quantity}});
          await cartModel.updateOne({ userid: userID }, { $pull: { products: { productid: cartdata.products[i].productid._id } } });
        }
        res.redirect("/account/orders");
        // res.redirect("/account/orders");
  
    } catch(error) {
        res.send(error.message)
    }
  }
  
  
  
  
  
  //admin Side
  const order_admin_controller = async(req,res) => {
    
    try {
      const order = await orderModel.find({}).populate("products.productid").populate("userid").lean().exec();
      console.log("================================");
      console.log(order)
      console.log("================================");
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