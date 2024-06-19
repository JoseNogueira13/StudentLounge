const { Projects, Alumni } = require('../models');

async function addProject(req, res) {
    const { alumniId } = req.params;
    const { title, description, url } = req.body;

    try {
        if (parseInt(alumniId, 10) !== req.user.alumniId) {
            return res.status(403).json({ message: 'You are not allowed to add a project to another account' });
        }

        const alumni = await Alumni.findByPk(alumniId);
        if (!alumni) {
            return res.status(404).json({ message: 'The alumni does not exist' });
        }

        await Projects.create({
            alumniId,
            title,
            description,
            url
        });

        res.status(200).json({ message: 'Project added successfully' });
    } catch (error) {
        console.error('Error adding project:', error);
        res.status(500).json({ message: 'Something went wrong. Please try again later' });
    }
}

async function alterProject(req, res) {
    const { projectId } = req.params;
    const { title, description, url } = req.body;

    try {
        const project = await Projects.findByPk(projectId);

        if (!project) {
            return res.status(404).json({ message: 'The project does not exist' });
        }

        if (project.alumniId !== req.user.alumniId) {
            return res.status(403).json({ message: 'You are not allowed to alter this project' });
        }

        if (title) project.title = title;
        if (description) project.description = description;
        if (url) project.url = url;

        await project.save();

        res.status(200).json({ message: 'Project altered successfully' });
    } catch (error) {
        console.error('Error altering project:', error);
        res.status(500).json({ message: 'Something went wrong. Please try again later' });
    }
}

async function getProject(req, res) {
    const { projectId } = req.params;

    try {
        const project = await Projects.findByPk(projectId);

        if (!project) {
            return res.status(404).json({ message: 'The requested project does not exist.' });
        }

        res.status(200).json(project);
    } catch (error) {
        console.error('Error fetching project:', error);
        res.status(500).json({ message: 'Something went wrong. Please try again later' });
    }
}


async function deleteProject(req, res) {
    const { projectId } = req.params;

    try {
        const project = await Projects.findByPk(projectId);

        if (!project) {
            return res.status(404).json({ message: 'The project does not exist' });
        }

        if (project.alumniId !== req.user.alumniId) {
            return res.status(403).json({ message: 'You are not allowed to alter this project' });
        }

        await project.destroy();

        res.status(200).json({ message: 'Project deleted successfully' });
    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ message: 'Something went wrong. Please try again later' });
    }
}

module.exports = { addProject, alterProject, getProject, deleteProject };