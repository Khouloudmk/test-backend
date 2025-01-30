const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.post('/createProduct', productController.createProduct);
router.get('/getProducts', productController.getProducts);
router.get('/getProduct/:id', productController.getProduct);
router.put('/updateProduct/:id', productController.updateProduct);
router.delete('/deleteProduct/:id', productController.deleteProduct);
router.post('/createReview/:id/reviews', productController.createReview);
router.get('/getReviews/:id/reviews', productController.getReviews);
router.get('/pdf', productController.generatePdf);

module.exports = router;
