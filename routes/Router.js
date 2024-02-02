const express = require('express');
const router = express();

router.use('/api/offers', require('./OffersRoutes'));
router.use('/api/products', require('./ProductsRoutes'));
router.use('/api/accounts', require('./AccountsRoutes'));
router.use('/api/jobs', require('./jobsRoutes'));
router.use('/api/sheets', require('./SheetsRoutes'));

module.exports = router;