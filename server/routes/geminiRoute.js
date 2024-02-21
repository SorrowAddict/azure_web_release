const { geminiall } = require('../controllers/geminiController');
const { cosin } = require('../controllers/cosinController');

const router = require('express').Router();

router.post('/gemini/cosin/', cosin);

module.exports = router;
