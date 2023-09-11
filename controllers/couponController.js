const productModel = require("../models/productModel");
const couponModel = require("../models/couponModel");



const coupon = async (req, res) => {
    try {
      const bannerData = await bannerModel.find({});
      console.log(bannerData)
        res.render("admin/banner", { message: "", data: bannerData });
    } catch (error) {
      res.send(error.message);
    }
  };
  
  const add_coupon = async (req, res) => {
    products = await productModel.find({})
    res.render("admin/add_banner", { productList: products, message: "",data:""});
  };
  
  const add_coupon_post = async (req, res) => {
    bannerCheck = await bannerModel.findOne({banner_slug:slugify(req.body.banner_heading)}) 
    if(bannerCheck) {
      products = await productModel.find({})
      return res.render("admin/add_banner", {productList: products, message: "banner with this name exist",data:"" });
    } 
    let banner = {banner_heading:req.body.banner_heading,banner_slug:slugify(req.body.banner_heading),banner_description:req.body.banner_description,
        banner_url:req.body.product,banner_image:req.file.filename}
    await bannerModel.insertMany(banner);
    res.redirect("/banner");
  };

  const delete_coupon = async (req, res) => {
    const { id } = req.params;
    try {
      await bannerModel.findOneAndRemove({_id:id})
      res.send({message:"banner deleted successfully"})
    } catch(error) {
      res.send({message:error.message})
    }
  };

  module.exports = {coupon,add_coupon,add_coupon_post,delete_coupon}