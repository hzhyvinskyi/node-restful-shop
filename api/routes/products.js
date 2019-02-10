const express = require('express');
const multer = require('multer');
const mkdirp = require('mkdirp');
const router = express.Router();

let uploadedFilePath = `./uploads/${new Date().getFullYear()}/${new Date().getMonth() + 1}/${new Date().getDate()}/`;

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        mkdirp(uploadedFilePath, err => {
            if(err) {
                console.log('Can\'t create folder');
            } else {
                cb(null, uploadedFilePath);
            }
        });
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 2 // 2mb is max file size
    }
});

const productController = require('../controllers/productController');

router.get('/', productController.index);

router.get('/:id', productController.show);

router.post('/', upload.single('image'), productController.store);

router.put('/:id', productController.update);

router.delete('/:id', productController.destroy);

module.exports = router;