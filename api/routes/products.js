const express = require('express');
const router = express.Router();

const productController = require('../controllers/productController');

const upload = require('../../helpers/uploadFile');

router.get('/', productController.index);

router.get('/:id', productController.show);

router.post('/', upload.single('image'), productController.store);

router.put('/:id', productController.update);

router.delete('/:id', productController.destroy);

module.exports = router;