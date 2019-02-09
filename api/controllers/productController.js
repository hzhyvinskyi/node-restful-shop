// Load Product Model
const Product = require('../models/product');

// Product List
exports.index = (req, res) => {
    Product.find((err, products) => {
        if(err) {
            res.status(404).json({
                error: err
            });
        } else {
            res.status(200).json({
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
            });
        }
    });
}

// Product Detail
exports.show = (req, res) => {
    Product.findById(req.params.id, (err, product) => {
        if(err) {
            res.status(404).json({
                error: err
            });
        } else {
            res.status(200).json({
                id: product.id,
                name: product.name,
                price: product.price,
                category: product.category
            });
        }
    });
}

// Product Save
exports.store = (req, res) => {
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
                message: 'Product created successfully',
                url: req.protocol + '://' + req.get('host') + req.baseUrl + '/' + item.id
            });
        }
    });
}

// Product Update
exports.update = (req, res) => {
    Product.findByIdAndUpdate(req.params.id, {$set: req.body}, (err, product) => {
        if(err) {
            res.status(404).json({
                error: err
            });
        } else {
            res.status(200).json({
                message: 'Product updated successfully'
            });
        }
    });
}

// Product Delete
exports.destroy = (req, res) => {
    Product.findByIdAndRemove(req.params.id, err => {
        if(err) {
            res.status(404).json({
                error: err
            });
        } else {
            res.status(200).json({
                message: 'Product deleted successfully'
            });
        }
    });
}