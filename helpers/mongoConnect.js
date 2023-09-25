//mongoosh setup
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_DB_CONNECT)
.then(()=>{
    console.log("mongodb is connected");
}).catch(()=>{
    console.log("failed to connect");
})


module.exports = mongoose