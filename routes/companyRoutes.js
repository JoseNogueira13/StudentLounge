const express = require('express');
const router = express.Router();
const { validationResult } = require('express-validator');
const companyController = require('../controllers/companyController.js');
const {verifyToken, checkAdmin} = require('../authenticate/auth.js');

router.post('/', verifyToken, async (req, res, next) => {
    try {
        await companyController.createCompany(req, res);
    } catch (error) {
        next(error);
    }
});

module.exports = router;