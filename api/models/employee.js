const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const skills = ['PHP', 'Laravel', 'Symfony', 'JS', 'Node.js', 'Express.js', 'React.js', 'Vue.js', 'Angular', 'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Docker'];

const employeeSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    avatar: {
        type: String
    },
    active: {
        type: Boolean,
        default: false
    },
    department: {
        type: String,
        enum: ['Backend', 'Frontend', 'Design', 'Manager'],
        required: true
    },
    position: {
        type: String,
        enum: ['Trainee', 'Junior', 'Middle', 'Senior'],
        required: true
    },
    skills: [{
        type: String,
        enum: skills,
        required: true
    }]
});

module.exports = mongoose.model('Employee', employeeSchema);