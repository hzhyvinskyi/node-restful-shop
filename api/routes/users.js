const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

router.get('/', userController.index);

router.get('/:id', userController.show);

router.post('/login', userController.login);

router.post('/signup', userController.register);

router.put('/:id', userController.update);

router.delete('/:id', userController.delete);

module.exports = router;