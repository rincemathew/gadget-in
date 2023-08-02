// Import the express function
const express = require('express')
const app = express()

const path = require("path")

//loading environment variables(npm-dotenv)
require('dotenv').config()

//importing vhost for subdomin configuration(npm-vhost)
const vhost = require('vhost')


//nodemailer
const nodemailer = require("nodemailer");

//public files set here
// app.use('/static',express.static(path.join(__dirname,'public')))
app.use(express.static('public'))

//importing two router options user, admin
const userRouter = require('./routers/userRoute')
const adminRouter = require('./routers/adminRoute')

//session (npm-express-session)
var session = require('express-session')

//mongosh export
const mongoose = require('./helpers/mongoConnect')

//nocache
const nocache = require("nocache")
app.use(nocache())


//read input
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//template engine as ejs (npm - ejs)
app.set('view engine', 'ejs')

app.use(session({
    secret:'secret',
    resave:true,
    saveUninitialized:true
}))

//used vhost to create subdomains
app.use(vhost(process.env.DOMAIN_NAME, userRouter));
app.use(vhost(`admin.${process.env.DOMAIN_NAME}`, adminRouter));

// app.use('/user', userRouter)
// app.use('/admin', adminRouter)


// Start the server
app.listen(process.env.PORT,()=>console.log("Server Started"))



