const { addMessage } = require('../controllers/messageController');
const { geminiall } = require('../controllers/geminiController');

const router = require('express').Router();

router.post('/geminiall/', geminiall);
router.post('/addmsg/', addMessage);

module.exports = router;
