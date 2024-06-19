const { Company, Alumni, AlumniCompany } = require('../models');
const { Op } = require('sequelize');


async function createCompany(req, res) {
    const { name, type, location } = req.body;
    const normalizedName = name.trim().toLowerCase();

    try {
        const existingCompany = await Company.findOne({
            where: {
                name: normalizedName
            }
        });

        if (existingCompany) {
            return res.status(400).json({ error: 'A company with that name already exists' });
        }

        await Company.create({
            name : normalizedName,
            type,
            location
        });

        res.status(200).json({ message: 'Company created successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong. Please try again later' });
    }
}


async function getAllCompanies(req, res) {
    const { name, type, location, page = 1, limit = 10 } = req.query;

    try {
        const where = {};
        if (name) where.name = { [Op.like]: `%${name}%` };
        if (type) where.type = { [Op.like]: `%${type}%` };
        if (location) where.location = { [Op.like]: `%${location}%` };

        const offset = (page - 1) * limit;

        const { count, rows } = await Company.findAndCountAll({
            where,
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        if (rows.length === 0) {
            return res.status(404).json({ message: 'No companies were found that match the filters' });
        }

        const totalPages = Math.ceil(count / limit);

        res.status(200).json({
            pagination: {
                total: count,
                pages: totalPages,
                current: parseInt(page),
                limit: parseInt(limit)
            },
            data: rows.map(company => ({
                companyId: company.id,
                name: company.name,
                type: company.type,
                location: company.location,
                links: [
                    { rel: 'self', href: `/companies/${company.id}`, method: 'GET' }
                ]
            }))
        });
    } catch (error) {
        console.error('Error getting companies:', error);
        res.status(500).json({ message: 'Something went wrong. Please try again later' });
    }
}

async function alterCompany(req, res) {
    const companyId = req.params.companyId;
    const { name, type, location } = req.body;

    try {
        const company = await Company.findByPk(companyId);
        if (!company) {
            return res.status(404).json({ message: 'The company does not exist' });
        }

        company.name = name || company.name;
        company.type = type || company.type;
        company.location = location || company.location;
        await company.save();

        res.status(200).json({ message: 'Company altered successfully' });
    } catch (error) {
        console.error('Error updating company:', error);
        res.status(500).json({ message: 'Something went wrong. Please try again later' });
    }
}

async function getCompany(req, res) {
    const companyId = req.params.companyId;

    try {
        const company = await Company.findByPk(companyId);

        if (!company) {
            return res.status(404).json({ message: 'The company does not exist' });
        }

        res.status(200).json({
            companyId: company.id,
            name: company.name,
            type: company.type,
            location: company.location
        });
    } catch (error) {
        console.error('Error fetching company:', error);
        res.status(500).json({ message: 'Something went wrong. Please try again later' });
    }
}

async function getCompanyAlumni(req, res) {
    const { companyId } = req.params;

    try {
        const company = await Company.findByPk(companyId);
        if (!company) {
            return res.status(404).json({ message: 'The company does not exist' });
        }

        const companyAlumni = await AlumniCompany.findAll({
            where: {companyId},
            include: [{ 
                model: Alumni,
                attributes: ['name', 'email'],
            }]
        });

        const alumni = companyAlumni.map(alumni => ({
            name: alumni.Alumni.name,
            email: alumni.Alumni.email
        }));

        if (alumni.length === 0) {
            return res.status(404).json({ message: 'No alumni found for this company' });
        }

        res.status(200).json({
            company: company.name,
            alumni
        });


    } catch (error) {
        res.status(500).json({ message: 'Something went wrong. Please try again later' });
    }
}

async function deleteCompany(req, res) {
    const { companyId } = req.params;

    try {
        const company = await Company.findByPk(companyId);
        if (!company) {
            return res.status(404).json({ message: 'The company does not exist' });
        }

        await company.destroy();

        res.status(200).json({ message: 'Company deleted successfully' });
    } catch (error) {
        console.error('Error deleting company:', error);
        res.status(500).json({ message: 'Something went wrong. Please try again later' });
    }
}

module.exports = { createCompany, getAllCompanies, alterCompany, getCompany, getCompanyAlumni, deleteCompany};