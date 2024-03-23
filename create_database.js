const mongoose = require("mongoose");
var url = "mongodb://localhost:27017";

const userSchema = new mongoose.Schema({
    username : String,
    password : String
})

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const User = mongoose.model("User", userSchema)