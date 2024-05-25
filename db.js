const mongoose = require("mongoose");
var url = "mongodb://127.0.0.1:27017/gatherTogether";
const User = require('./models/user');

mongoose.connect(url, {
    /*useNewUrlParser: true,
    useUnifiedTopology: true*/
}).then(() => {
    console.log("connected lol")
    /*
    User.find()
      .then(async users => {
        const newUser = new User({ username: "username", email: "email", password: "password" });
        await newUser.save();
        console.log('Users:', users);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });
      */
}).catch((error) => {
    console.log(error)
})

module.exports = mongoose