const express = require('express');
const router = express.Router();

//Controllers
const { attPrices } = require('../controllers/JobsController');

//Middlewares

//Routes
router.get('/attPrices', attPrices);

module.exports = router;