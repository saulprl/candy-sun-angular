const express = require('express');

const checkAuth = require('../middlewares/check-auth');
const categoryController = require('../controllers/category-controller');

const router = express.Router();

router.get('/', checkAuth, categoryController.getCategories);

router.post('/', checkAuth, categoryController.addCategory);

router.put('/:_id', checkAuth, categoryController.updateCategory);

router.delete('/:_id', checkAuth, categoryController.deleteCategory);

module.exports = router;
