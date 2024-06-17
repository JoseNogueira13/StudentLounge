const { Company } = require('../models');


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
        console.log(error);
        res.status(500).json({ error: 'Something went wrong. Please try again later' });
    }
}

module.exports = {
    createCompany
};