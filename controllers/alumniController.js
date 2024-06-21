const { Alumni, AlumniCompany, Company, Posts, FavoritePosts, AlumniEvents, Events, Projects} = require('../models');
const { formatDate } = require('../utils/date.js');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');
const secret = process.env.SECRET_KEY;

async function registerAlumni(req, res) {
    const { username, password, studentNumber, email, name, currentProfession, skills } = req.body;
    const alumniSkills = skills.split(',').map(skill => skill.trim());

    
    try {
        
        const existingAlumni = await Alumni.findOne({
            where: {
                [Op.or]: [
                    { username: username },
                    { studentNumber: studentNumber },
                    { email: email }
                ]
            }
        });

        if (existingAlumni) {
            return res.status(400).json({ error: 'An account with those credentials already exist. You should use a different username, email or student number' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await Alumni.create({
            username,
            password: hashedPassword,
            email,
            studentNumber,            
            name,
            experiencePoints: 0,
            level: 1,
            currentProfession: currentProfession || null,
            skills: alumniSkills.join(', ') || null,
            isAdmin: false
        });
        
        res.status(201).json({ message: 'Account registered successfully'});

    } catch (error) {
        res.status(500).json({ error: 'Something went wrong. Please try again later' });
    } 
}


async function login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Please provide email and password' });
    }

    try {
        const alumni = await Alumni.findOne({
            where: {
                email
            }
        });

        if (!alumni) {
            return res.status(404).json({ error: 'Invalid credentials' });
        }

        const isPasswordValid = await bcrypt.compare(password, alumni.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { alumniId: alumni.alumniId, email: alumni.email, isAdmin: alumni.isAdmin },
            secret,
            { expiresIn: '1h' }
        );

        res.status(200).json({token: token, message: 'login was successful' });

    } catch (error) {
        console.log(secret);
        res.status(500).json({ error: 'Something went wrong. Please try again later' });
    }
}

async function updateAlumni(req, res) {
    const { username, password, email, name, currentCompany, skills } = req.body;
    const { alumniId } = req.user;

    try {
        const alumni = await Alumni.findByPk(alumniId);
        if (!alumni) {
            return res.status(404).json({ message: 'The account you are trying to alter does not exist' });
        }

        if (username) {
            const existingUsername = await Alumni.findOne({ where: { username } });
            if (existingUsername) {
                return res.status(409).json({ message: 'Those credentials already exist. You should use a different username' });
            }
            alumni.username = username;
        }

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            alumni.password = hashedPassword;
        }

        if (email) {
            const existingEmail = await Alumni.findOne({ where: { email } });
            if (existingEmail) {
                return res.status(409).json({ message: 'Those credentials already exist. You should use a different email' });
            }
            alumni.email = email;
        }

        if (name) alumni.name = name;
        if (currentCompany) alumni.currentCompany = currentCompany;
        if (skills) alumni.skills = skills;

        await alumni.save();

        res.status(200).json({ message: 'Account altered successfully' });
    } catch (error) {
        console.error('Error updating alumni account:', error);
        res.status(500).json({ message: 'Something went wrong. Please try again later' });
    }
}


async function deleteAlumni(req, res) {
    const { alumniId } = req.params;
    const { alumniId: userId, isAdmin } = req.user;

    try {
        let idToDelete;
        if (alumniId === 'me') {
            idToDelete = userId;
        } else {
            if (!isAdmin) {
                return res.status(403).json({ error: 'Forbidden: You do not have permission to delete this account' });
            }
            idToDelete = alumniId;
        }

        const alumni = await Alumni.findByPk(idToDelete);
        if (!alumni) {
            return res.status(404).json({ error: 'Alumni account not found' });
        }

        await Alumni.destroy({
            where: {
                alumniId: idToDelete
            }
        });

        res.status(200).json({ message: 'Account deleted successfully' });

    } catch (error) {
        console.error('Error deleting alumni account:', error);
        res.status(500).json({ error: 'Something went wrong. Please try again later' });
    }
}

async function getAlumni(req, res) {
    const { alumniId } = req.params;

    try {
        const alumni = await Alumni.findByPk(alumniId);
        if (!alumni) {
            return res.status(404).json({ message: 'The alumni does not exist' });
        }

        res.status(200).json({
            email: alumni.email,
            name: alumni.name,
            currentCompany: alumni.currentProfession,
            skills: alumni.skills.split(',').map(skill => skill.trim())
        });

    } catch (error) {
        res.status(500).json({ message: 'Something went wrong. Please try again later' });
    }
}

async function getAllAlumni(req, res) {
    const { name, profession, skills, companies, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (name) where.name = { [Op.like]: `%${name}%` };
    if (profession) where.currentProfession = { [Op.like]: `%${profession}%` };
    if (skills) where.skills = { [Op.like]: `%${skills}%` };
    if (companies) where.currentProfession = { [Op.like]: `%${companies}%` };

    try {
        const { count, rows } = await Alumni.findAndCountAll({
            where,
            limit: parseInt(limit, 10),
            offset,
        });

        const alumni = rows.map(alumnus => ({
            alumniId: alumnus.alumniId,
            name: alumnus.name,
            profession: alumnus.currentProfession,
            skills: alumnus.skills.split(',').map(skill => skill.trim()),
            companies: alumnus.currentProfession.split(',').map(company => company.trim()),
            links: [
                { rel: 'self', href: `/alumni/${alumnus.alumniId}`, method: 'GET' }
            ]
        }));

        const totalPages = Math.ceil(count / limit);

        res.status(200).json({
            pagination: {
                total: count,
                pages: totalPages,
                current: parseInt(page, 10),
                limit: parseInt(limit, 10),
            },
            alumni,
            links: [
                { rel: 'prev-page', href: `/alumni?page=${page > 1 ? page - 1 : 1}&limit=${limit}`, method: 'GET' },
                { rel: 'next-page', href: `/alumni?page=${parseInt(page, 10) + 1}&limit=${limit}`, method: 'GET' }
            ]
        });

    } catch (error) {
        res.status(500).json({ message: 'Something went wrong. Please try again later' });
    }
}

async function getAlumniCompanies(req, res) {
    const { alumniId } = req.params;

    try {
        const alumni = await Alumni.findByPk(alumniId);
        if (!alumni) {
            return res.status(404).json({ message: 'The alumni does not exist' });
        }

        const alumniCompanies = await AlumniCompany.findAll({
            where: {
                alumniId
            },
            include: Company
        });

        const companies = alumniCompanies.map(alumniCompany => ({
            companyName: alumniCompany.Company.name,
            type: alumniCompany.Company.type,
            location: alumniCompany.Company.location,
            startDate: formatDate(alumniCompany.startDate),
            endDate: formatDate(alumniCompany.endDate)
        }));

        res.status(200).json({
            alumni: alumni.name,
            companies: companies
        });

    } catch (error) {
        console.error('Error getting alumni companies:', error);
        res.status(500).json({ message: 'Something went wrong. Please try again later' });
    }
}

async function addAlumniToCompany(req, res) {
    const { alumniId } = req.params;
    const { companyId, startDate, endDate } = req.body;

    try {
        const alumni = await Alumni.findByPk(alumniId);
        if (!alumni) {
            return res.status(404).json({ message: 'The alumni does not exist' });
        }

        const company = await Company.findByPk(companyId);
        if (!company) {
            return res.status(404).json({ message: 'The company does not exist' });
        }

        if (!startDate || !endDate) {
            return res.status(400).json({ message: 'The data you provIded is incorrect or missing' });            
        }

        const existingAlumniCompany = await AlumniCompany.findOne({
            where: {
                alumniId,
                companyId
            }
        });

        if (existingAlumniCompany) {
            return res.status(409).json({ message: 'The alumni is already associated with the company' });
        }

        await AlumniCompany.create({
            alumniId,
            companyId,
            startDate: formatDate(startDate),
            endDate: formatDate(endDate)
        });

        // Update experience points and level
        alumni.experiencePoints += 200;
        if (alumni.experiencePoints >= 500) {
            alumni.experiencePoints = 0;
            alumni.level += 1;
        }
        await alumni.save();

        res.status(200).json({ message: 'Alumni added to the company successfully' });
    } catch (error) {
        console.error('Error adding alumni to company:', error);
        res.status(500).json({ message: 'Something went wrong. Please try again later' });
    }
}

async function getFavoritePosts(req, res) {
    const { alumniId } = req.params;

    try {
        const alumni = await Alumni.findByPk(alumniId);
        if (!alumni) {
            return res.status(404).json({ message: 'The alumni does not exist' });
        }

        const favoritePosts = await FavoritePosts.findAll({
            where: {
                alumniId
            },
            include: {
                model: Posts,
                attributes: ['postId', 'title', 'image', 'postBody']
            }
        });

        const posts = favoritePosts.map(favorite => favorite.Post);

        res.status(200).json({ posts });
    } catch (error) {
        console.error('Error getting alumni favorites:', error);
        res.status(500).json({ message: 'Something went wrong. Please try again later' });
    }
}


async function getAlumniEvents(req, res) {
    const { alumniId } = req.params;

    try {
        const alumni = await Alumni.findByPk(alumniId);
        if (!alumni) {
            return res.status(404).json({ message: 'The alumni does not exist' });
        }

        const alumniEvents = await AlumniEvents.findAll({
            where: { alumniId },
            include: [{
                model: Events,
                attributes: ['title', 'date', 'location']
            }]
        });

        const events = alumniEvents.map(alumniEvent => {
            const { title, date, location } = alumniEvent.Event;
            return { title, date, location };
        });

        res.status(200).json({
            alumni: alumni.name,
            events
        });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong. Please try again later' });
    }
}

async function getAlumniProjects(req, res) {
    const { alumniId } = req.params;

    try {
        const alumni = await Alumni.findByPk(alumniId);
        if (!alumni) {
            return res.status(404).json({ message: 'The alumni does not exist' });
        }

        const projects = await Projects.findAll({
            where: { alumniId }
        });

        res.status(200).json({ projects });
    } catch (error) {
        console.error('Error getting alumni projects:', error);
        res.status(500).json({ message: 'Something went wrong. Please try again later' });
    }
}


module.exports = { registerAlumni, login, updateAlumni, deleteAlumni, getAlumni, getAllAlumni, getAlumniCompanies,  addAlumniToCompany, getFavoritePosts, getAlumniEvents, getAlumniProjects};