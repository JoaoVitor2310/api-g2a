const express = require('express');
const router = express.Router();

//Controllers
const {compareById, priceResearcher} = require('../controllers/ProductsController');

//Middlewares

//Routes
router.post('/compareById', compareById);
router.get('/priceResearcher/:productId', priceResearcher);



module.exports = router;