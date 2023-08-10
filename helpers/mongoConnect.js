//mongoosh setup
const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/gadget4in")
.then(()=>{
    console.log("mongodb is connected");
}).catch(()=>{
    console.log("failed to connect");
})


module.exports = mongoose