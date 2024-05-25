const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new mongoose.Schema({
    username: {type: String, unique: true, required: true},
    email: {type: String, required: true},
    password : {type: String, required: true}
    /*,
    roomsCreated: [{type: String, unique: true}],
    rooms: [{ 
        code: { type: String, unique: true},
        time: [roomTimeSchema],
    }]*/
})

const User = mongoose.model('User', userSchema)

module.exports = User