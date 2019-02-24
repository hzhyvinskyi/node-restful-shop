const express = require('express');
const router = express.Router();
const checkAuth = require('../../middlewares/checkAuth');
const employeeController = require('../../controllers/employee/employeeController');
const upload = require('../../../helpers/uploadFile');

router.get('/', employeeController.index);
router.get('/:id', employeeController.show);
router.post('/', upload.single('avatar'), employeeController.store);
router.put('/:id', upload.single('avatar'), employeeController.update);
router.delete('/:id', employeeController.destroy);

module.exports = router;