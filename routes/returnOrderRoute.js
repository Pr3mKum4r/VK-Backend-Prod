const express = require('express');
const router = express.Router();
const returnOrderController = require('../controllers/returnOrderController');

// POST route for creating a return order
router.post('/create-return', returnOrderController.createReturnOrder);

module.exports = router;
