const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    productId: {
        type: Number,
        require: true
    },
    quantity: {
        type: Number,
        require: true
    }
});

module.exports = mongoose.model('Order', OrderSchema);