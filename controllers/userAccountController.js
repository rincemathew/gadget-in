const productModel = require("../models/productModel");
const userModel = require("../models/userModel");
const transporter = require("../helpers/nodeMailer");
const categoryModel = require("../models/categoryModel");
const addressModel = require("../models/addressModel");
const orderModel = require("../models/orderModel");
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

const wishlist = async (req, res) => {
  try {
    data = "";
    res.render("user/wishlist", {
      session: res.locals.sessionValue,
      data: data,
    });
  } catch (error) {
    res.send(error.message);
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
      data: addresses,
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

const orders = async (req, res) => {
  const userID = req.session.user_id;
  try {
    orderData = await orderModel
      .findOne({ userid: userID })
      .populate("products.productid");
    console.log(orderData + "ooooooooooooo");
    res.render("user/order", {
      session: res.locals.sessionValue,
      data: orderData,
    });
  } catch (error) {
    res.send(error.message);
  }
};

const cancel_order = async (req, res) => {
  const userID = req.session.user_id;
  const { id } = req.params;
  try {
    // await orderModel.findOne({userid:userID},{ $set: { productid: { _id: id } } }
    const updateResponse = await orderModel.updateOne(
      { userid: new mongoose.Types.ObjectId(userID) },
      {
        $set: {
          "products.$[product].status": "cancelled",
        },
      },
      {
        arrayFilters: [
          { "product.productid": new mongoose.Types.ObjectId(id) },
        ],
      }
    );
    // If order has not been updated
    if (updateResponse.modifiedCount === 0) {
        console.log('Updating order unsuccessful -------------------')
      // res.send({isOk: false, error: "Updating order unsuccessful"})
      //   return;
    }

    // const orderdata = await orderModel.findOne({ userid: userID }).populate("products.productid");
    // const count = 0;
    // for(i=0;i<orderdata.products.length;i++) {
    //     if(orderdata.products[i].productid._id == id) {
    //         count = orderdata.products[i].productid.quantity
    //         const stockMinus = await productModel.findOne({ _id: orderdata.products[i].productid._id },)
    //         await productModel.updateOne({_id:orderdata.products[i].productid._id},{$set:{stock:stockMinus.stock + count}});
    //     }
    // }
    // await productModel.updateOne({_id:cartdata.products[i].productid._id},{$set:{stock:stockMinus.stock - cartdata.products[i].quantity}});

    console.log('ORDER HAS BEEN UPDATED SUCCESSFULLY ------------------------')
    res.send({ popUp: "Product Cancelled" });
  } catch (error) {
    res.send(error.message);
  }
};

module.exports = {
  profile,
  profilePost,
  wishlist,
  address,
  address_get,
  address_add,
  address_edit,
  address_delete,
  orders,
  cancel_order,
};
