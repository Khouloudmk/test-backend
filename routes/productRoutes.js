const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.post('/createProduct', productController.createProduct);
router.get('/getProducts', productController.getProducts);
router.put('/updateProduct/:id', productController.updateProduct);
router.delete('/deleteProduct/:id', productController.deleteProduct);

module.exports = router;
