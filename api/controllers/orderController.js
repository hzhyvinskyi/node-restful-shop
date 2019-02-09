// Load Order Model
const Order = require('../models/order');

// Order List
exports.index = (req, res) => {
    Order.find()
        .select('id product quantity')
        .populate('product', 'id name category price')
        .exec((err, orders) => {
            if(err) {
                res.status(404).json({
                    error: err
                });
            } else {
                res.status(200).json({
                    count: orders.length,
                    orders: orders.map(order => {
                        return {
                            id: order.id,
                            product: {
                                id: order.product.id,
                                name: order.product.name,
                                category: order.product.category,
                                price: order.product.price,
                                request: {
                                    type: 'GET',
                                    url: req.protocol + '://' + req.get('host') + '/products/' + order.product.id
                                }
                            },
                            quantity: order.quantity,
                            request: {
                                type: req.method,
                                url: req.protocol + '://' + req.get('host') + req.baseUrl + '/' + order.id
                            }
                        }
                    })
                });
            }
        });
}

// Order Detail
exports.show = (req, res) => {
    Order.findById(req.params.id)
        .select('id product quantity')
        .populate('product', 'id name category price')
        .exec((err, order) => {
        if(err) {
            res.status(404).json({
                error: err
            });
        } else {
            res.status(200).json({
                id: order.id,
                product: {
                    id: order.product.id,
                    name: order.product.name,
                    category: order.product.category,
                    price: order.product.price,
                    request: {
                        type: 'GET',
                        url: req.protocol + '://' + req.get('host') + '/products/' + order.product.id
                    }
                },
                quantity: order.quantity
            });
        }
    });
}

// Order Save
exports.store = (req, res) => {
    const order = {
        product: req.body.product,
        quantity: req.body.quantity
    }
    new Order(order).save((err, item) => {
        if(err) {
            res.status(404).json({
                error: err
            });
        } else {
            res.status(201).json({
                message: 'Order created',
                order: {
                    id: item.id,
                    product: item.product,
                    quantity: item.quantity,
                    url: req.protocol + '://' + req.get('host') + req.baseUrl + '/' + item.id
                }
            });
        }
    });
}

// Order Update
exports.update = (req, res) => {
    Order.findByIdAndUpdate(
        req.params.id,
        {
            $set: {
                product: req.body.product, quantity: req.body.quantity
            }
        },
        (err, order) => {
            if(err) {
                res.status(404).json({
                    error: err
                });
            } else {
                res.status(200).json({
                    message: 'Order updated successfully',
                    order: {
                        id: req.params.id,
                        product: req.body.product,
                        quantity: req.body.quantity
                    }
                });
            }
        }
    );
}

// Order Delete
exports.destroy = (req, res) => {
    Order.findByIdAndRemove(req.params.id, err => {
        if(err) {
            res.status(404).json({
                error: err
            });
        } else {
            res.status(200).json({
                message: 'Order deleted successfully'
            });
        }
    });
}