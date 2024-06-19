const express = require('express');
const router = express.Router();
const { validationResult } = require('express-validator');
const projectController = require('../controllers/projectController.js');
const {verifyToken, checkAdmin} = require('../authenticate/auth.js');


router.post('/:alumniId', verifyToken, async(req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        await projectController.addProject(req, res);
    } catch (error) {
        next(error);
    }
});

router.patch('/:projectId', verifyToken, async(req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        await projectController.alterProject(req, res);
    } catch (error) {
        next(error);
    }
});

router.get('/:projectId', verifyToken, async(req, res, next) => {
    try {
        await projectController.getProject(req, res);
    } catch (error) {
        next(error);
    }
});

router.delete('/:projectId', verifyToken, async(req, res, next) => {
    try {
        await projectController.deleteProject(req, res);
    } catch (error) {
        next(error);
    }
});

module.exports = router;