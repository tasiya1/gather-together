const mongoose = require('mongoose');
const { Schema } = mongoose;

const roomTimeSchema = new Schema({
    roomCode: String,
    editedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    date: Date, // початкова дата для тижня
    cells: [[Number]] // масив одиниць і нулів
});


const TimeCells = mongoose.model('TimeCell', roomTimeSchema)

module.exports = TimeCells