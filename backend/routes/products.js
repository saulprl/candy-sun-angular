const express = require('express');

const checkAuth = require('../middlewares/check-auth');
const productController = require('../controllers/product-controller');

const router = express.Router();

router.get('/', checkAuth, productController.getProducts);

router.post('/', checkAuth, productController.addProduct);

router.put('/:_id', checkAuth, productController.updateProduct);

router.delete('/:_id', checkAuth, productController.deleteProduct);

module.exports = router;
