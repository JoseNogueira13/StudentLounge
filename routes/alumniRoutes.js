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

router.patch('/', verifyToken, async (req, res, next) => {
    try {
        await alumniController.updateAlumni(req, res);
    } catch (error) {
        next(error);
    }
});

router.delete('/:alumniId', verifyToken, async (req, res, next) => {
    try {
        await alumniController.deleteAlumni(req, res);
    } catch (error) {
        next(error);
    }
});

router.get('/:alumniId', verifyToken, async (req, res, next) => {
    try {
        await alumniController.getAlumni(req, res);
    } catch (error) {
        next(error);
    }
});

router.get('/', verifyToken, async (req, res, next) => {
    try {
        await alumniController.getAllAlumni(req, res);
    } catch (error) {
        next(error);
    }
});

router.get('/:alumniId/companies', verifyToken, async (req, res, next) => {
    try {
        await alumniController.getAlumniCompanies(req, res);
    } catch (error) {
        next(error);
    }
});


module.exports = router;