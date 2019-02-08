const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).json({
        message: 'Orders list'
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
    res.status(200).json({
        message: 'Order created'
    })
});

router.put('/:id', (req, res) => {
    res.status(200).json({
        message: 'Order updated'
    });
});

router.delete('/:id', (req, res) => {
    res.status(200).json({
        message: 'Order deleted'
    });
});

module.exports = router;