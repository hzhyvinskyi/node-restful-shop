const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    name: {
        type: String,
        require: true,
        max: 100
    },
    category: {
        type: String,
        require: true,
        max: 50
    },
    price: {
        type: Number,
        require: true
    }
});

module.exports = mongoose.model('Product', ProductSchema);