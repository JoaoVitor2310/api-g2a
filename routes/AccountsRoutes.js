const express = require('express');
const router = express.Router();

//Controllers
const { accountData, calculateFinalPrice } = require('../controllers/AccountsController');

//Middlewares

//Routes
router.get('/accountData', accountData);
router.get('/calculateFinalPrice', calculateFinalPrice);

module.exports = router;