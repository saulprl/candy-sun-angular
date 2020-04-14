const express = require('express');

const checkAuth = require('../middlewares/check-auth');
const userController = require('../controllers/user-controller');

const router = express.Router();

router.post('/login', userController.login);
router.post('/signup', checkAuth, userController.createUser);

module.exports = router;
