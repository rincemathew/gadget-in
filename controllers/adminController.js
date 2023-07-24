const multer = require("multer");
const adminSchema = require("../models/adminSchema");
const productModel = require("../models/productModel");
const categoryModel = require("../models/categoryModel");

////LOGIN
const admin_login = async (req, res) => {
  res.render("admin/index", { message: "" });
};

const login_admin = async (req, res) => {
  try {
    const admindata = await adminSchema.findOne({
      admin_name: req.body.username,
    });
    console.log(admindata.name);

    if (admindata) {
      // console.log(userdata.username);
      if (admindata.admin_password === req.body.password) {
        // req.session.admin_id=admindata.username
        res.render("admin/dashboard");
      } else {
        res.render("admin/index", { message: "invalid password" });
      }
    } else {
      // console.log("error");
      res.render("admin/index", { message: "Admin does not exist" });
    }
  } catch (error) {
    res.send(error.message);
  }
};

////DASHBOARD
const dashboard = async (req, res) => {
  res.render("admin/dashboard", { message: "" });
};

//PRODUCTS
const products = async (req, res) => {
  try {
    const productData = await productModel.find({}).lean().exec();

    if (productData) {
      res.render("admin/products", { message: "", data: productData });
    //   console.log(productData);
    }
  } catch (error) {
    res.send(error.message);
  }
  // res.render('admin/products',{message: "",})
};

const add_product = async (req, res) => {
  res.render("admin/add_products", { message: "",data:"" });
};

const add_product_post = async (req, res) => {
  productImages = [];
  // console.log(req.files)
  req.files.forEach((file) => {
    productImages.push(file.filename);
  });

  const data = {
    product_name: req.body.product_name,
    description: req.body.description,
    category: req.body.category,
    stock: req.body.stock,
    price: req.body.price,
    product_image: productImages,
    is_blocked: req.body.isBlocked == "on" ? true : false,
  };
  // console.log(data)
  await productModel.insertMany([data]);
  res.redirect("/products");
  // res.render('admin/products',{message: "product created",})
};

// const products_visibility = async (req, res) => {
//   res.render("admin/products", { message: "hai" });
// };

const edit_product = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await productModel.findOne(
      { _id: id },
    );
    // console.log(data)
    res.render("admin/add_products", { data:data, message: "hai" });
    // res.send('Hai');
  } catch (err) {
    console.trace(err);
    res.send({ isOk: false, message: "Some error occured" });
  }
};

const edit_product_post = async (req, res) => {
    try{
        // console.log(req.body.product_name + "haooo",req.params.id)
        await productModel.updateOne({_id:req.params.id},{$set:{product_name:req.body.product_name,
            description:req.body.description,category:req.body.category,stock:req.body.stock,price:req.body.price}});
          res.redirect("/products");
    }catch(err) {
        console.log(err)
    }
    
};

const setProductIsBlocked = async (req, res, isBlocked) => {
  try {
    const { id } = req.params;
    const updateResponse = await productModel.updateOne(
      { _id: id },
      { is_blocked: isBlocked }
    );
    if (updateResponse.modifiedCount === 0) {
      console.log("No document was updated");
      res.send({ isOk: false, message: "Some error occured" });
      return;
    }
    res.send({ isOk: true, message: "" });
  } catch (err) {
    console.trace(err);
    res.send({ isOk: false, message: "Some error occured" });
  }
};

const unblock_product = async (req, res) => {
  setProductIsBlocked(req, res, false);
};

const block_product = async (req, res) => {
  setProductIsBlocked(req, res, true);
};

//CATEGORIES
const categories = async (req, res) => {
  try {
    const categoryData = await categoryModel.find({});
    // console.log(categoryData);
    if (categoryData) {
      res.render("admin/categories", { message: "", data: categoryData });
    }
  } catch (error) {
    res.send(error.message);
  }
};

const add_categories = async (req, res) => {
  res.render("admin/add_categories", { message: "",data:"" });
};

const add_categories_post = async (req, res) => {
  console.log(req.body.categories_name)
  await categoryModel.insertMany({category_name:req.body.categories_name});
  res.redirect("/categories");
};

const categories_block_unblock = async (req, res) => {
  try {
    const { id } = req.params;
    const categoryData = await categoryModel.findOne({_id:id});
    value = categoryData.is_blocked==true?false:true
    console.log(value)
    await categoryModel.updateOne({ _id: id },{ is_blocked: value });
    await productModel.updateMany({ category: categoryData.category_name },{ is_blocked: !value });
    res.send({ isOk: true, message: "" });
  } catch (err) {
    console.trace(err);
    res.send({ isOk: false, message: "Some error occured" });
  }
};

//USER PROFILE
const user_profile = async (req, res) => {
  res.render("admin/user_profile", { message: "" });
};

module.exports = {
  admin_login,
  login_admin,
  dashboard,
  products,
  add_product,
  add_product_post,
  edit_product,
  edit_product_post,
  unblock_product,
  block_product,
  categories,
  add_categories,
  add_categories_post,
  categories_block_unblock,
  user_profile,
};
