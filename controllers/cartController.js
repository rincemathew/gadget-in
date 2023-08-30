const  productModel  = require("../models/productModel")
const  userModel  = require("../models/userModel")
const categoryModel = require("../models/categoryModel");
const cartModel = require("../models/cartModel");


//User Side 
const add_to_cart = async(req, res) => {
    const { id,value } = req.params;
    const userID = req.session.user_id
    try {
        const cart = await cartModel.findOne({ userid:userID });
        if(cart) {
            // const productExist = cartModel.products.findIndex((product) => {
            //     return product.productid.equals(productid);
            //   });
            await cartModel.findOneAndUpdate(
                { userid: userID },
                {
                  $push: { products: { productid: id, quantity: value } },
                },
                { new: true }
              );
    
        } else {
            await cartModel.insertMany({userid: userID,products: [{ productid: id, quantity: value }]})
        }
        res.send({ message: "",popUp:"item added to cart" });
      } catch (err) {
        res.send({ message: "",popUp:err.message });
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





//admin Side

module.exports = {
    add_to_cart,cart_view
}