const express = require('express');
const router = express.Router();
const cryptoController = require('../controllers/cryptoController');

// Endpoint для получения курсов криптовалют
router.get('/prices', cryptoController.getCryptoPrices);

module.exports = router;
