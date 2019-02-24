const express = require('express');
const router = express.Router();
const checkAuth = require('../middlewares/checkAuth');
const userController = require('../controllers/userController');

router.get('/', userController.index);
router.get('/:id', userController.show);
router.post('/login', userController.login);
router.post('/register', userController.register);
router.delete('/:id', checkAuth, userController.delete);

module.exports = router;