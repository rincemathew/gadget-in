const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: 'gmail',
   host: 'smtp.gmail.com',
   port: 465,
   secure: true,
   auth: {
    user: 'rincemathew.m@gmail.com',
    pass: 'pasmgkpblwiovmts',
   },
  });
  
  const otp = Math.floor(1000 + Math.random() * 9000);


  module.exports = transporter