const  productModel  = require("../models/productModel")
const  userModel  = require("../models/userModel")
const categoryModel = require("../models/categoryModel");
const cartModel = require("../models/cartModel");
const addressModel = require("../models/addressModel");
const orderModel = require("../models/orderModel");
const mongoose = require("mongoose");


//User Side 
const add_to_cart = async(req, res) => {
    const { id,value } = req.params;
    const userID = req.session.user_id
    try {
      const productCount = await productModel.findOne({ _id: id });
      if (productCount.stock < value) {
        res.send({ message: "", popUp: "Sorry... Product out of Stock" });
      } else {
        const cart = await cartModel.findOne({ userid: userID });
        if (cart) {
          const productExist = cart.products.findIndex((product) => {
              return product.productid.equals(id);
            });

            if (productExist !== -1) {
                res.send({ message: "", popUp: "Product already in the cart" });
            } else {
                await cartModel.findOneAndUpdate(
                    { userid: userID },
                    {
                      $push: { products: { productid: id, quantity: value } },
                    },
                    { new: true }
                  );
                  res.send({ message: "", popUp: "Product added to Cart" });
            }
          
        } else {
          await cartModel.insertMany({
            userid: userID,
            products: [{ productid: id, quantity: value }],
          });
          res.send({ message: "", popUp: "Product added to Cart" });
        }
        
      }
    } catch (err) {
      res.send({ message: "", popUp: err.message });
    }
}


const cart_view = async(req,res) => {
    try {
        res.render("user/cart",{session:res.locals.sessionValue});

    } catch(error) {
        res.send(error.message)
    }
}

const cart_view_ajax = async(req,res) => {
  try {
      const userID = req.session.user_id
      const cartdata = await cartModel.findOne({ userid: userID }).populate("products.productid");
      console.log(cartdata)
      res.send({cart: cartdata,popUp:''});

  } catch(error) {
      res.send(error.message)
  }
}

const cart_count_increse = async(req,res) => {
  const {id} = req.params
  const value = req.body
  try {
      const userID = req.session.user_id
      const productdata = await productModel.findOne({ _id: id })
      if(productdata.stock <= value.val) {
        res.send({popUp:'item not avilable'})
        return;
      }
      await cartModel.updateOne({userid: userID,"products.productid": id,},{$inc: {"products.$.quantity": 1,},});
      res.send({popUp:''});

  } catch(error) {
      res.send(error.message)
  }
}

const cart_count_decrese = async(req,res) => {
  const {id} = req.params
  const value = req.body
  try {
    const userID = req.session.user_id
    const productdata = await productModel.findOne({ _id: id })
    // if(1 >= value.val) {
    //   res.send({popUp:''})
    //   return;
    // }
    await cartModel.updateOne({userid: userID,"products.productid": id,},{$inc: {"products.$.quantity": -1,},});
    res.send({popUp:''});

  } catch(error) {
      res.send(error.message)
  }
}


const delete_cart_item = async(req,res) => {
  const {id} = req.params
  const userID = req.session.user_id
  try {
    await cartModel.updateOne(
      { userid: userID },
      { $pull: { products: { productid: id } } }
    );
    res.status(200).send({ popUp: "item deleted sucessfully" });
  } catch (error) {
    res.status(200).send({ popUp: error.message });
  }
}






module.exports = {
    add_to_cart,cart_view,cart_view_ajax,cart_count_increse,cart_count_decrese,delete_cart_item,}