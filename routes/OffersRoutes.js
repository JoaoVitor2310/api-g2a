const express = require('express');
const router = express.Router();


//Controllers
const {offerList, searchOfferById, editOffer, offerKeys, returnOfferId, returnOffersData} = require('../controllers/OffersController');

//Middlewares

//Routes
router.get('/offersList', offerList);
router.get('/returnOffersData', returnOffersData);
router.get('/searchOfferById/:offerId', searchOfferById);
router.patch('/editOffer', editOffer);
router.get('/returnOfferId/:productId', returnOfferId);

module.exports = router;