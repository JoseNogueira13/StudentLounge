const express = require('express');
const router = express.Router();
const { validationResult } = require('express-validator');
const alumniController = require('../controllers/alumniController');
const { registerAlumniValidator, loginAlumniValidator } = require('../validators/alumniValidators');
const { verifyToken, checkAdmin } = require('../authenticate/auth');

router.post('/', registerAlumniValidator, async(req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        await alumniController.registerAlumni(req, res);
    } catch (error) {
        next(error);
    };
});

router.post('/login', loginAlumniValidator, async(req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        await alumniController.login(req, res);
    } catch (error) {
        next(error);
    };
});

router.delete('/deleteAccount', verifyToken, async(req, res, next) => {
    try {
        await alumniController.deleteAccount(req, res);
    } catch (error) {
        next(error);
    };
});

router.delete('/:alumniId', verifyToken, checkAdmin, async(req, res, next) => {
    try {
        await alumniController.deleteAlumni(req, res);
    } catch (error) {
        next(error);
    };
});

module.exports = router;