const express = require('express');
const router = express.Router();
const { startChat, getConversations } = require('../controllers/chatController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getConversations);
router.get('/start/:userId', protect, startChat);
router.post('/delete/:userId', protect, require('../controllers/chatController').deleteConversation);

module.exports = router;
