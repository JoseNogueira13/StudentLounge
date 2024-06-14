const { Alumni } = require('../models');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');
const secret = require('../config').secretKey;

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
        res.status(500).json({ error: 'Something went wrong. Please try again later' });
    }
}

async function deleteAccount(req, res) {
    const { alumniId } = req.user;

    try {
        const alumni = await Alumni.findByPk(alumniId);
        if (!alumni) {
            return res.status(404).json({ error: 'Alumni account not found' });
        }

        await Alumni.destroy({
            where: {
                alumniId
            }
        });

        res.status(200).json({ message: 'Account deleted successfully' });

    } catch (error) {
        res.status(500).json({ error: 'Something went wrong. Please try again later' });
    }
}

async function deleteAlumni(req, res) {
    const { alumniId } = req.params;
    console.log(alumniId);

    try {
        const alumni = await Alumni.findByPk(alumniId);
        if (!alumni) {
            return res.status(404).json({ error: 'Alumni account not found' });
        }

        await Alumni.destroy({
            where: {
                alumniId
            }
        });

        res.status(200).json({ message: 'Account deleted successfully' });

    } catch (error) {
        res.status(500).json({ error: 'Something went wrong. Please try again later', error });
    }
}

module.exports = { registerAlumni, login, deleteAccount, deleteAlumni};