// Import the express function
const express = require('express')
const app = express()

const path = require("path")

//loading environment variables(npm-dotenv)
require('dotenv').config()

//importing vhost for subdomin configuration(npm-vhost)
const vhost = require('vhost')

//public files set here
app.use(express.static('public'))

//importing two router options user, admin
const userRouter = require('./routers/userRoute')
const adminRouter = require('./routers/adminRoute')

//mongosh export
const mongoose = require('./helpers/mongoConnect')


//read input
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


//template engine as ejs (npm - ejs)
app.set('view engine', 'ejs')



//used vhost to create subdomains
// app.use(vhost(process.env.DOMAIN_NAME, userRouter));
// app.use(vhost(`admin.${process.env.DOMAIN_NAME}`, adminRouter));

app.use('/user', userRouter)
app.use('/admin', adminRouter)


// Start the server
app.listen(process.env.PORT,()=>console.log("Server Started"))



