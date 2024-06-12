const {Router} = require('express');
const userController = require('../controllers/userController.js');

const router = Router();

router.post('/saveUserOrder', userController.saveUserOrder);

module.exports = router;