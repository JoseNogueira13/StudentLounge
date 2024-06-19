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

router.get('/', verifyToken, async (req, res, next) => {
    try {
        await companyController.getAllCompanies(req, res);
    } catch (error) {
        next(error);
    }
});

router.patch('/:companyId', verifyToken, async (req, res, next) => {
    try {
        await companyController.alterCompany(req, res);
    } catch (error) {
        next(error);
    }
});

router.get('/:companyId', verifyToken, async (req, res, next) => {
    try {
        await companyController.getCompany(req, res);
    } catch (error) {
        next(error);
    }
});

router.get('/:companyId/alumni', verifyToken, async (req, res, next) => {
    try {
        await companyController.getCompanyAlumni(req, res);
    } catch (error) {
        next(error);
    }
});

router.delete('/:companyId', verifyToken, checkAdmin, async (req, res, next) => {
    try {
        await companyController.deleteCompany(req, res);
    } catch (error) {
        next(error);
    }
});

module.exports = router;