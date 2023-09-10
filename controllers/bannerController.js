const productModel = require("../models/productModel");
const bannerModel = require("../models/bannerModel");
const {slugify} = require('..//helpers/validator')



const banner = async (req, res) => {
    try {
      const bannerData = await bannerModel.find({});
      console.log(bannerData)
        res.render("admin/banner", { message: "", data: bannerData });
    } catch (error) {
      res.send(error.message);
    }
  };
  
  const add_banner = async (req, res) => {
    products = await productModel.find({})
    res.render("admin/add_banner", { productList: products, message: "",data:""});
  };
  
  const add_banner_post = async (req, res) => {
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

  module.exports = {banner,add_banner,add_banner_post}