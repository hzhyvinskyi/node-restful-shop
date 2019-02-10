const express = require('express');
const router = express.Router();

const employeeController = require('../controllers/employeeController');

router.get('/', employeeController.index);

router.get('/:id', employeeController.show);

router.post('/', employeeController.store);

router.put('/:id', employeeController.update);

router.delete('/:id', employeeController.destroy);

module.exports = router;