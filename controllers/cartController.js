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
    console.log('hhhhhhhhhhhhhhhhhhhhhh')
    try {
        // const userID = req.session.user_id
        // const cartdata = await cartModel.findOne({ userid: userID }).populate("products.productid");
        // console.log(cartdata)
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
    add_to_cart,cart_view,cart_view_ajax,cart_count_increse,cart_count_decrese,delete_cart_item,checkout,checkout_post,order_admin_controller,
    order_delivery_confirm
}