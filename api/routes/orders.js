const express = require('express');
const router = express.Router();

const Order = require('../models/order');

router.get('/', (req, res) => {
    Order.find()
        .select('id product quantity')
        .populate('product', 'id name category price')
        .exec((err, orders) => {
            if(err) {
                res.status(400).json({
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
});

router.get('/:id', (req, res) => {
    Order.findById(req.params.id)
        .select('id product quantity')
        .populate('product', 'id name category price')
        .exec((err, order) => {
        if(err) {
            res.status(400).json({
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
});

router.post('/', (req, res) => {
    const order = {
        product: req.body.product,
        quantity: req.body.quantity
    }
    new Order(order).save((err, item) => {
        if(err) {
            res.status(400).json({
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
});

router.put('/:id', (req, res) => {
    Order.findByIdAndUpdate(
        req.params.id,
        {
            $set: {
                product: req.body.product, quantity: req.body.quantity
            }
        },
        (err, order) => {
            if(err) {
                res.status(400).json({
                    error: err
                });
            } else {
                res.status(200).json({
                    message: 'Order updated successfully',
                    order: {
                        id: order.id,
                        product: req.body.product,
                        quantity: req.body.quantity
                    }
                });
            }
        }
    );
});

router.delete('/:id', (req, res) => {
    Order.findByIdAndRemove(req.params.id, err => {
        if(err) {
            res.status(400).json({
                error: err
            });
        } else {
            res.status(200).json({
                message: 'Order deleted successfully'
            });
        }
    });
});

module.exports = router;