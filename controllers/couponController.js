const productModel = require("../models/productModel");
const couponModel = require("../models/couponModel");



const coupon = async (req, res) => {
    try {
      const couponData = await couponModel.find({});
        res.render("admin/coupon", { message: "", data: couponData });
    } catch (error) {
      res.send(error.message);
    }
  };
  
  const add_coupon = async (req, res) => {
    res.render("admin/add_coupon", { message: "",data:""});
  };
  
  const add_coupon_post = async (req, res) => { 
    let coupon = {coupon_description:req.body.coupon_description,coupon_code:req.body.coupon_code,
        coupon_type:req.body.coupon_type,coupon_value:req.body.coupon_value,expire_date:req.body.expire_date,minimum_amount:req.body.minimum_amount}
        console.log(coupon)
    await couponModel.insertMany(coupon);
    res.redirect("/coupon");
  };

  const delete_coupon = async (req, res) => {
    const { id } = req.params;
    try {
      await couponModel.findOneAndRemove({_id:id})
      res.send({message:"coupon deleted successfully"})
    } catch(error) {
      res.send({message:error.message})
    }
  };


  //user side 
  const display_coupon = async (req, res) => {
    const { id } = req.params;
    try {
      const couponData = await couponModel.find({});
        res.send({ message: "", data: couponData });
    } catch (error) {
      res.send(error.message);
    }
  };

  module.exports = {coupon,add_coupon,add_coupon_post,delete_coupon,display_coupon}