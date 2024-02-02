const express = require('express');
const router = express.Router();

//Controllers
const {productsList, productIds, compareAll, compareById, productsBySlug} = require('../controllers/ProductsController');

//Middlewares

//Routes
router.get('/productsList', productsList);
router.get('/productIds', productIds);
router.post('/compareAll', compareAll);
router.get('/compareById/:id', compareById);
router.get('/productsBySlug', productsBySlug);



module.exports = router;