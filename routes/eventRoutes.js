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

router.patch('/:eventId', verifyToken, checkAdmin, async(req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        await eventController.updateEvent(req, res);
    } catch (error) {
        next(error);
    }
});

router.get('/', async(req, res, next) => {
    try {
        await eventController.getAllEvents(req, res);
    } catch (error) {
        next(error);
    }
});

router.get('/:eventId', async(req, res, next) => {
    try {
        await eventController.getEvent(req, res);
    } catch (error) {
        next(error);
    }
});

router.post('/:eventId/participants', verifyToken, checkAdmin, async(req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        await eventController.addParticipant(req, res);
    } catch (error) {
        next(error);
    }
});

router.delete('/:eventId/participants/:alumniId', verifyToken, checkAdmin, async(req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        await eventController.removeParticipant(req, res);
    } catch (error) {
        next(error);
    }
});
module.exports = router;