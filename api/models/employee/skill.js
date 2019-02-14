const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const skillSchema = new Schema({
    employee: {
        type: Schema.Types.ObjectId,
        ref: 'employee',
        required: true
    },
    technology: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Skill', skillSchema);