const productModel = require("../models/productModel");
const userModel = require("../models/userModel");
const transporter = require("../helpers/nodeMailer");
const categoryModel = require("../models/categoryModel");
const addressModel = require("../models/addressModel");
const orderModel = require("../models/orderModel");
const cartModel = require("../models/cartModel")
const wishlistModel = require("../models/wishlistModel")
const mongoose = require("mongoose");

const profile = async (req, res) => {
  const userID = req.session.user_id;
  try {
    profileItem = await userModel.findOne({ _id: userID });
    res.render("user/profile", {
      session: res.locals.sessionValue,
      data: profileItem,
    });
  } catch (error) {
    res.send(error.message);
  }
};

const profilePost = async (req, res) => {
  console.log(req.body.birth_date + " dssdsdsdsdsd");
  try {
    await userModel.updateOne(
      { _id: req.session.user_id },
      {
        $set: {
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          email_id: req.body.email_id,
          mobile: req.body.mobile,
          birth_date: req.body.birth_date,
        },
      }
    );
    res.redirect("/account/profile");
  } catch (error) {
    res.send(error.message);
  }
};

const wishlist = async (req, res, next) => {
  const userID = req.session.user_id
  try {
    
    const wishlistItems = await wishlistModel.findOne({userid:userID}).populate("products.productid")
    console.log(wishlistItems)
    res.render("user/wishlist",{message:"",popUp:"",data:wishlistItems,session:res.locals.sessionValue})
  } catch (error) {
    next()
  }
};

const wishlistAdd = async (req, res) => {
  const { id } = req.params;
  const userID = req.session.user_id

  try {

    const wishlistData = await wishlistModel.findOne({ userid: userID })

    if(wishlistData) {
      const wishlistExist = wishlistData.products.findIndex((product) => {
        return product.productid.equals(id);
      });

      if (wishlistExist !== -1) {
          return res.send({ message: "", popUp: "Product already in the Wishlist" });
      }
    }

    await wishlistModel.findOneAndUpdate(
      { userid: userID },
      { $push: { products: { productid: id} } },
      { upsert: true, new: true }
    )
    res.send({message:"",popUp:"Product added to wishlist"})
  } catch (error) {
    res.send(error.message);
  }
};

const wishlistDelete = async (req, res) => {
  const { id } = req.params;
  const userID = req.session.user_id
  try {

    const updatedWishlist = await wishlistModel.findOneAndUpdate(
      { userid: userID },
      { $pull: { products: { productid: id } } },
      { new: true }
    );

    if (!updatedWishlist) {
      res.send({popUp:'Wishlist not found for the user'});
    } else {
      res.send({popUp:'Product removed from the wishlist'});
    }
    
  } catch (error) {
    res.send(error.message);
  }
};

const wishlistToCart = async (req, res) => {
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
                  await wishlistModel.findOneAndUpdate(
                    { userid: userID },
                    { $pull: { products: { productid: id } } },
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
  } catch (error) {
    res.send({popUp:error.message});
  }
};

const address = async (req, res) => {
  const userID = req.session.user_id;
  try {
    addresses = await addressModel.findOne({ userid: userID });
    console.log(addresses);
    // await cartModel.findOne({ userid: userID }).populate("products.productid");
    // res.status(200).send({addressList:addresses})
    res.render("user/address", {
      session: res.locals.sessionValue,
      data: addresses,message:""
    });
  } catch (error) {
    res.status(200).send(error.message);
  }
};

const address_get = async (req, res) => {
  let addresses = "";
  const userID = req.session.user_id;
  try {
    addresses = await addressModel.findOne({ userid: userID });
    console.log(addresses);
    // await cartModel.findOne({ userid: userID }).populate("products.productid");
    res.status(200).send({ addressList: addresses });
    // res.render("user/address",{session:res.locals.sessionValue,data: addresses,});
  } catch (error) {
    res.status(200).send(error.message);
  }
};

const address_add = async (req, res) => {
  const userID = req.session.user_id;
  try {
    data = req.body;
    // console.log(data)
    const addressHas = await addressModel.findOne({ userid: userID });
    if (addressHas) {
      await addressModel.findOneAndUpdate(
        { userid: userID },
        {
          $push: { address: data },
        },
        { new: true }
      );
    } else {
      await addressModel.insertMany({
        userid: userID,
        address: [data],
      });
    }

    res.status(200).send({ popUp: "Address added sucessfully" });
    // res.render("user/address",{session:res.locals.sessionValue,data: data,});
  } catch (error) {
    res.send(error.message);
  }
};
//not inplimented
const address_edit = async (req, res) => {
  try {
    data = "";
    res.render("user/address", {
      session: res.locals.sessionValue,
      data: data,
    });
  } catch (error) {
    res.send(error.message);
  }
};

const address_delete = async (req, res) => {
  const userID = req.session.user_id;
  try {
    // deleteID = req.body
    console.log(req.body.unIDD + "iqwer");
    await addressModel.updateOne(
      { userid: userID },
      { $pull: { address: { _id: req.body.unIDD } } }
    );
    // addresses = await addressModel.findOne({userid:userID})
    // await cartModel.findOne({ userid: userID }).populate("products.productid");
    res.status(200).send({ popUp: "address deleted sucessfully" });
    // res.render("user/address",{session:res.locals.sessionValue,data: addresses,});
  } catch (error) {
    res.status(200).send({ popUp: error.message });
  }
};


const wallet = async (req, res) => {
  const userID = req.session.user_id;
  try {
    // orderData = await orderModel
    //   .findOne({ userid: userID })
    // console.log(orderData + "ooooooooooooo");
    // res.render("user/order", {
    //   session: res.locals.sessionValue,
    //   data: orderData,
    // });
    res.render("user/wallet",{session:res.locals.sessionValue,message:"",popUp:""})
  } catch (error) {
    res.send(error.message);
  }
};

module.exports = {
  profile,
  profilePost,
  wishlist,wishlistAdd,wishlistDelete,wishlistToCart,
  address,
  address_get,
  address_add,
  address_edit,
  address_delete,wallet
};
