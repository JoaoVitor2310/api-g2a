const express = require('express');
const router = express.Router();

//Controllers
const { catchFromSheet, dataKeysAnalyse} = require('../controllers/SheetsController');

//Middlewares

//Routes
router.get('/catchFromSheet', catchFromSheet);
router.get('/dataKeysAnalyse/:key', dataKeysAnalyse);

module.exports = router;