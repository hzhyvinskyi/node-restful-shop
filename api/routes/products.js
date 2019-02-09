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
            res.send(products);
        }
    });
});

router.get('/:id', (req, res, next) => {
    Product.findById(req.params.id, (err, product) => {
        if(err) {
            res.status(404).json({
                error: err
            });
        } else {
            res.send(product);
        }
    });
});

router.post('/', (req, res, next) => {
    const product = {
        name: req.body.name,
        category: req.body.category,
        price: req.body.price
    };

    new Product(product).save(err => {
        if(err) {
            res.status(404).json({
                error: err
            });
        } else {
            res.send('Product created successfully');
        }
    });
});

router.put('/:id', (req, res, next) => {
    Product.findByIdAndUpdate(req.params.id, {$set: req.body}, (err, product) => {
        if(err) {
            res.status(404).json({
                error: err
            });
        } else {
            res.send('Product updated successfully');
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
            res.send('Product deleted successfully');
        }
    });
});

module.exports = router;