const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const departmentSchema = new Schema({
    employee: {
        type: Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    sphere: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Department', departmentSchema);