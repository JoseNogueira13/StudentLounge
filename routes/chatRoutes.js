const express = require('express');
const router = express.Router();
const { validationResult } = require('express-validator');
const chatController = require('../controllers/chatController.js');
const {verifyToken} = require('../authenticate/auth.js');

router.post('/', verifyToken, async (req, res, next) => {
    try {
        await chatController.createChat(req, res);
    } catch (error) {
        next(error);
    }
});

router.get('/:alumniId', verifyToken, async (req, res, next) => {
    try {
        await chatController.getChats(req, res);
    } catch (error) {
        next(error);
    }
});

router.get('/:chatId/messages', verifyToken, async (req, res, next) => {
    try {
        await chatController.getMessages(req, res);
    } catch (error) {
        next(error);
    }
});

router.post('/:chatId/messages', verifyToken, async (req, res, next) => {
    try {
        await chatController.createMessage(req, res);
    } catch (error) {
        next(error);
    }
});

router.delete('/:chatId', verifyToken, async (req, res, next) => {
    try {
        await chatController.deleteChat(req, res);
    } catch (error) {
        next(error);
    }
});


module.exports = router;