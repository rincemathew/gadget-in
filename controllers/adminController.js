const multer = require("multer");
const adminModel = require("../models/adminModel");
const productModel = require("../models/productModel");
const categoryModel = require("../models/categoryModel");
const userModel = require("../models/userModel");
const orderModel = require("../models/orderModel");
const {slugify} = require('..//helpers/validator')

const sharp = require('sharp');

////LOGIN

const admin_login = async (req, res) => {
  if(req.session.username) {
    res.redirect("/dashboard");
  } else {
    res.render("admin/index", { message: "" });
  }
};

const admin_logout = async (req, res) => {
  req.session.destroy()
  res.redirect("/")
};

const login_admin = async (req, res) => {
  try {
    let dataUser = await adminModel.findOne({slug: req.body.username});
    if(!dataUser) {
      dataUser = await adminModel.findOne({email_id: req.body.username})
    }
    if (dataUser) {
      if (dataUser.password === req.body.password) {
        req.session.slug = dataUser.slug
        res.redirect("/dashboard");
      } else {
        res.render("admin/index", { message: "invalid Username Password" });
      }
    } else {
      res.render("admin/index", { message: "Admin does not exist" });
    }
  } catch (error) {
    res.render("admin/index", { message: "Check Your INTERNET Connection" })// res.send(error.message);
  }
};

//ADMIN SESSION CHECK
const session_check = async(req,res, next) => {
  if(req.session.slug) {
    next()
  } else {
    res.redirect("/");
  }
}

////DASHBOARD
const dashboard = async (req, res) => {
  userslists = await userModel.find({})
  productslists = await productModel.find({})
  categorieslists = await categoryModel.find({})
  orderlists = await orderModel.find({}).populate("orders").populate("user_id").sort({_id:-1}).lean().exec();
  console.log(orderlists)
  res.render("admin/dashboard", { message: "",order:orderlists?orderlists.length:0,user:userslists?userslists.length:0,product:productslists?productslists.length:0,category:categorieslists?categorieslists.length:0,  });
};

//PRODUCTS
const products = async (req, res) => {
  try {
    const itemsPerPage = 5;
    const pages = parseInt(req.query.page) || 1;
    const totalCount = await productModel.countDocuments();
    const skipItems = (pages - 1) * itemsPerPage;
    const totalPages = Math.ceil(totalCount / itemsPerPage);
    const productData = await productModel.find({}).skip(skipItems).limit(itemsPerPage)

    if (productData) {
      res.render("admin/products", { message: "", data: productData,totalPage:totalPages,currentPage:pages });
    //   console.log(productData);
    }
  } catch (error) {
    res.send(error.message);
  }
  // res.render('admin/products',{message: "",})
};

const add_product = async (req, res) => {
  try{
    let cateList = await categoryModel.find({});
    console.log(cateList)
    res.render("admin/add_products", { message: "",data:"",categoriesList :cateList });
  } catch(err) {
    res.send({ message: "Some error occured" });
  }
  
};

const add_product_post = async (req, res) => {
  productCheck = await productModel.findOne({product_slug:slugify(req.body.brand_name+ " " +req.body.product_name)}) 
  if(productCheck) {
    let cateList = await categoryModel.find({});
    return res.render("admin/add_products", { message: "Product with this name exist",data:"",categoriesList :cateList });
  } 
  const data = {
    product_brand_name:req.body.brand_name,
    product_name: req.body.product_name,
    product_slug:slugify(req.body.brand_name+ " " +req.body.product_name),
    description: req.body.description,
    category: req.body.category,
    stock: req.body.stock,
    price: req.body.price,
    product_image: [],
    is_blocked: req.body.isBlocked ? true : false,
  };

  for (const image of req.files) {
    const imageBuffer = await sharp(image.path)
      .resize({ width: 350, height: 350, fit: 'cover' })
      .toBuffer();
  
    const processedFileName = Date.now() + '-';
    await sharp(imageBuffer).toFile(`public/uploads/${processedFileName}`);
  
    data.product_image.push(processedFileName);
  }
  await productModel.insertMany([data]);
  res.redirect("/products");
};



const edit_product = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await productModel.findOne({ _id: id },);
    let cateList = await categoryModel.find({});
    res.render("admin/edit_products", { data:data, message: "",categoriesList :cateList });
  } catch (err) {
    console.trace(err);
    res.send({ isOk: false, message: "Some error occured" });
  }
};

const edit_product_post = async (req, res) => {
  
    try{
      const productList = await productModel.findOne({ _id: req.params.id },);

      const data = {
        product_brand_name:req.body.brand_name,
        product_name: req.body.product_name,
        product_slug:slugify(req.body.brand_name+ " " +req.body.product_name),
        description: req.body.description,
        category: req.body.category,
        stock: req.body.stock,
        price: req.body.price,
        product_image: [...productList.product_image],
        is_blocked: req.body.isBlocked ? true : false,
      };
      for (const image of req.files) {
        const imageBuffer = await sharp(image.path)
          .resize({ width: 350, height: 350, fit: 'cover' })
          .toBuffer();
        const processedFileName = Date.now() + '-';
        await sharp(imageBuffer).toFile(`public/uploads/${processedFileName}`);
        data.product_image.push(processedFileName); }


        await productModel.updateOne({_id:req.params.id},{$set:data});
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
    res.send({ isOk: true, message: `Product ${isBlocked?"Blocked":"unBlocked"} successfully` });
  } catch (err) {
    console.trace(err);
    res.send({ isOk: false, message: "Some error occured" });
  }
};

const productImageDelete = async (req, res) => {
  try{
    const {name,productId} = req.body
    const product = await productModel.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (!name) {
      return res.status(400).json({ message: "Image name is required" });
    }
    const imageIndex = product.product_image.indexOf(name);

    if (imageIndex === -1) {
      return res.status(404).json({ message: "Image not found in the product" });
    }
    product.product_image.splice(imageIndex, 1);
    
    await product.save();


    res.send({message:"",popUp:""})
  }catch(err) {
    res.send({message:err.message})
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
    console.log(categoryData)
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
  categryCheck = await categoryModel.findOne({category_slug:slugify(req.body.categories_name)}) 
  if(categryCheck) {
    return res.render("admin/add_categories", { message: "Category with this name exist",data:"" });
  } 
  let category = {category_name:req.body.categories_name,category_slug:slugify(req.body.categories_name),is_blocked:req.body.isBlocked ? true : false,category_image:req.file?req.file.filename:''}
  await categoryModel.insertMany(category);
  res.redirect("/categories");
};

const categories_block_unblock = async (req, res) => {
  try {
    const { id } = req.params;
    const categoryData = await categoryModel.findOne({_id:id});
    value = categoryData.is_blocked==true?false:true

    console.log(value)
    await categoryModel.updateOne({ _id: id },{ is_blocked: value });
    await productModel.updateMany({ category: categoryData.category_name },{ is_blocked: value });
    res.send({ isOk: true, message: `Category "${categoryData.category_name}" ${value?'blocked':'unblocked'} Successfully` });
  } catch (err) {
    console.trace(err);
    res.send({ isOk: false, message: "Some error occured" });
  }
};

//USER PROFILE
const user_profile = async (req, res) => {
  try {
    const userDate = await userModel.find({});
    if (userDate) {
      res.render("admin/user_profile", { message: "", data: userDate });
    }
  } catch (error) {
    res.send(error.message);
  }
};


const user_block_unblock = async (req, res) => {
  try {
    const { id } = req.params;
    const userData = await userModel.findOne({_id:id});
    value = userData.is_blocked==true?false:true
    await userModel.updateOne({ _id: id },{ is_blocked: value });
    res.send({ isOk: true, message: `User "${userData.first_name}" ${value?'unblocked':'blocked'} Successfully` });
  } catch (err) {
    console.trace(err);
    res.send({ isOk: false, message: "Some error occured" });
  }
};


//404
const page404 = async (req, res) => {
  res.render("admin/404", { message: ""});
};


module.exports = {
  session_check,
  admin_login,
  admin_logout,
  login_admin,
  dashboard,
  products,
  add_product,
  add_product_post,
  edit_product,
  edit_product_post,
  productImageDelete,
  unblock_product,
  block_product,
  categories,
  add_categories,
  add_categories_post,
  categories_block_unblock,
  user_profile,
  user_block_unblock,
  page404
};
