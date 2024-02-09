const express = require('express');
const router = express.Router();

//Controllers
const {compareById} = require('../controllers/ProductsController');

//Middlewares

//Routes
router.post('/compareById', compareById);



module.exports = router;