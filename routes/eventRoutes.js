const express = require('express');
const router = express.Router();
const { validationResult } = require('express-validator');
const eventController = require('../controllers/eventController.js');
const {verifyToken, checkAdmin} = require('../authenticate/auth.js');

router.post('/', verifyToken, checkAdmin, async(req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        await eventController.postEvent(req, res);
    } catch (error) {
        next(error);
    }
});


module.exports = router;