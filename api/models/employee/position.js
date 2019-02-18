const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const positionSchema = new Schema({
    employee: {
        type: Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    rank: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Position', positionSchema);