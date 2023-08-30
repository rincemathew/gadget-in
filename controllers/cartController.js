const  productModel  = require("../models/productModel")
const  userModel  = require("../models/userModel")
const categoryModel = require("../models/categoryModel");
const cartModel = require("../models/cartModel");
const addressModel = require("../models/addressModel");


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
        const userID = req.session.user_id
        const cartdata = await cartModel.findOne({ userid: userID }).populate("products.productid");
        console.log(cartdata)
        res.render("user/cart",{session:res.locals.sessionValue,cart: cartdata,});

    } catch(error) {
        res.send(error.message)
    }
}


const checkout = async(req,res) => {
  try {
    let total = 0;
      const userID = req.session.user_id
      const addresses = await addressModel.findOne({userid:userID})
      // console.log(addresses)
      const cartdata = await cartModel.findOne({ userid: userID }).populate("products.productid");
      console.log(cartdata)
      for(i=0;i<cartdata.products.length;i++) {
        total = total + (cartdata.products[i].productid.price * cartdata.products[i].quantity)
      }
      console.log(cartdata.products[0].productid.price+"product iidddddd")
      res.render("user/check_out",{session:res.locals.sessionValue,addresss:addresses,cart:cartdata,total:total});

  } catch(error) {
      res.send(error.message)
  }
}


const checkout_post = async(req,res) => {
  try {
    let total = 0;
      const userID = req.session.user_id
      const addresses = await addressModel.findOne({userid:userID})
      // console.log(addresses)
      const cartdata = await cartModel.findOne({ userid: userID }).populate("products.productid");
      console.log(cartdata)
      for(i=0;i<cartdata.products.length;i++) {
        total = total + (cartdata.products[i].productid.price * cartdata.products[i].quantity)
      }
      console.log(cartdata.products[0].productid.price+"product iidddddd")
      res.redirect("/account/orders");

  } catch(error) {
      res.send(error.message)
  }
}





//admin Side

module.exports = {
    add_to_cart,cart_view,checkout,checkout_post,order
}