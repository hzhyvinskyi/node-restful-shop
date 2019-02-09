const express = require('express');
const router = express.Router();

const Product = require('../models/product');

router.get('/', (req, res) => {
    Product.find((err, products) => {
        if(err) {
            res.status(404).json({
                error: err
            });
        } else {
            res.status(200).json({
                data: {
                    count: products.length,
                    products: products.map(product => {
                        return {
                            id: product.id,
                            name: product.name,
                            price: product.price,
                            category: product.category,
                            request: {
                                type: req.method,
                                url: req.protocol + '://' + req.get('host') + req.baseUrl + '/' + product.id,
                            }
                        }
                    })
                }
            });
        }
    });
});

router.get('/:id', (req, res) => {
    Product.findById(req.params.id, (err, product) => {
        if(err) {
            res.status(404).json({
                error: err
            });
        } else {
            res.status(200).json({
                data: {
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    categort: product.category
                }
            });
        }
    });
});

router.post('/', (req, res) => {
    const product = {
        name: req.body.name,
        category: req.body.category,
        price: req.body.price
    };

    new Product(product).save((err, item) => {
        if(err) {
            res.status(404).json({
                error: err
            });
        } else {
            res.status(201).json({
                data: {
                    message: 'Product created successfully',
                    url: req.protocol + '://' + req.get('host') + req.baseUrl + '/' + item.id
                }
            });
        }
    });
});

router.put('/:id', (req, res) => {
    Product.findByIdAndUpdate(req.params.id, {$set: req.body}, (err, product) => {
        if(err) {
            res.status(404).json({
                error: err
            });
        } else {
            res.status(200).json({
                data: {
                    message: 'Product updated successfully'
                }
            });
        }
    });
});

router.delete('/:id', (req, res) => {
    Product.findByIdAndRemove(req.params.id, err => {
        if(err) {
            res.status(404).json({
                error: err
            });
        } else {
            res.status(200).json({
                data: {
                    message: 'Product deleted successfully'
                }
            });
        }
    });
});

module.exports = router;