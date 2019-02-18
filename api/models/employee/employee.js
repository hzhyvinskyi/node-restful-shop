const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const employeeSchema = new Schema({
    _id: Schema.Types.ObjectId,
    name: {
        type: String,
        required: true
    },
    avatar: {
        type: String
    },
    active: {
        type: Boolean,
        default: true
    },
    department: [{
        type: Schema.Types.ObjectId,
        ref: 'Department',
        required: true
    }],
    position: [{
        type: Schema.Types.ObjectId,
        ref: 'Position',
        required: true
    }],
    skills: [{
        type: Schema.Types.ObjectId,
        ref: 'Skill',
        required: true
    }]
});

module.exports = mongoose.model('Employee', employeeSchema);