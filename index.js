// Import the express function
const express = require('express')
const app = express()

//loading environment variables
require('dotenv').config()

//importing vhost for subdomin configuration
const vhost = require('vhost')

//importing two router options user, admin
const userRouter = require('./routers/userRoute')
const adminRouter = require('./routers/adminRoute')

//used vhost to create subdomains
app.use(vhost(process.env.DOMAIN_NAME, userRouter));
app.use(vhost(`admin.${process.env.DOMAIN_NAME}`, adminRouter));


// Start the server
app.listen(process.env.PORT,()=>console.log("Server Started"))



