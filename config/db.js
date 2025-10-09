const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/recipe')
.then(()=> console.log("connected"))
.catch((err)=>console.log("somthing went wrong ",err));


module.exports = mongoose.connection;