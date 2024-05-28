const mongoose = require('mongoose');
const { Schema } = mongoose;

const roomAdminSchema = new Schema({
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    code: {type: String, unique: true},
    startingDate: {type: Date, required: true}
})

const Room = mongoose.model('Room', roomAdminSchema)

module.exports = Room