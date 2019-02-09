const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).json({
        message: 'Products list'
    });
});

router.get('/:id', (req, res) => {
    const id = req.params.id;
    if(id === 'secret') {
        res.status(200).json({
            message: 'Discovered!',
            id: id
        });
    } else {
        res.status(404).json({
            message: 'Not Found'
        });
    }
});

router.post('/', (req, res) => {
    const product = {
        name: req.body.name,
        price: req.body.price
    }
    res.status(201).json({
        message: 'Product created',
        product: product
    });
});

router.put('/:id', (req, res) => {
    res.status(200).json({
        message: 'Product updated'
    });
});

router.delete('/:id', (req, res) => {
    res.status(200).json({
        message: 'Product deleted'
    });
});

module.exports = router;