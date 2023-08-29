const  productModel  = require("../models/productModel")
const  userModel  = require("../models/userModel")
const categoryModel = require("../models/categoryModel");
const cartModel = require("../models/cartModel");


//User Side 
const add_to_cart = async(req, res) => {
    const { id } = req.params;
    const userID = req.session.user_id
    console.log(id,userID)
    try {
        console.log('one')
        const cart = await cartModel.findOne({ userid:userID });
        if(cart) {
            console.log('two')
            await cartModel.findOneAndUpdate(
                { userid: userID },
                {
                  $push: { products: { productid: id, quantity: 1 } },
                },
                { new: true }
              );
    
        } else {
            console.log('three')
            await cartModel.insertMany({userid: userID,products: [{ productid: id, quantity: 1 }]})
        }
        res.send({ message: "added sucessfully" });
        // const categoryData = await categoryModel.findOne({_id:id});
        // value = categoryData.is_blocked==true?false:true
    
        // await categoryModel.updateOne({ _id: id },{ is_blocked: value });
        // await productModel.updateMany({ category: categoryData.category_name },{ is_blocked: value });
        // res.send({ isOk: true, message: `Category "${categoryData.category_name}" ${value?'blocked':'unblocked'} Successfully` });
      } catch (err) {
        res.send({ message: err.message });
      }
}






//admin Side

module.exports = {
    add_to_cart
}