const express = require('express');

const checkAuth = require('../middlewares/check-auth');
const userController = require('../controllers/user-controller');

const router = express.Router();

router.post('/login', userController.login);
router.get('/', checkAuth, userController.getUsers);
router.put('/:_id', checkAuth, userController.updateUser);
router.delete('/:_id', checkAuth, userController.deleteUser);
router.post('/signup', checkAuth, userController.createUser);

module.exports = router;
