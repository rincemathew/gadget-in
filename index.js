// Import the express function
const express = require('express')
const app = express()

//loading environment variables(npm-dotenv)
require('dotenv').config()

//importing vhost for subdomin configuration(npm-vhost)
const vhost = require('vhost')

//read input
const path = require("path")
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//mongoosh setup
const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/gadget-in")
.then(()=>{
    console.log("mongodb is connected");
}).catch(()=>{
    console.log("failed to connect");
})


//public files set here
app.use(express.static('public'))

//template engine as ejs (npm - ejs)
app.set('view engine', 'ejs')

//importing two router options user, admin
const userRouter = require('./routers/userRoute')
const adminRouter = require('./routers/adminRoute')

//used vhost to create subdomains
app.use(vhost(process.env.DOMAIN_NAME, userRouter));
app.use(vhost(`admin.${process.env.DOMAIN_NAME}`, adminRouter));


// Start the server
app.listen(process.env.PORT,()=>console.log("Server Started"))



