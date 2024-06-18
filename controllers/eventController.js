const { Events, Alumni, AlumniEvents } = require('../models');
const { formatDate } = require('../utils/date.js');


async function postEvent(req, res) {
    const { title, date, location } = req.body;
    
    try {
        const existingEvent = await Events.findOne({
            where: {
                title
            }
        });

        if (existingEvent) {
            return res.status(400).json({ error: 'An event with that title already exists' });
        }

        await Events.create({
            title,
            date: formatDate(date),
            location
        });

        res.status(200).json({ message: 'The event was created successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Something went wrong. Please try again later' });
    }
}

async function updateEvent(req, res) {
    const { title, date, location } = req.body;
    const { eventId } = req.params;

    try {
        const event = await Events.findByPk(eventId);

        if (!event) {
            return res.status(404).json({ message: 'The event does not exist' });
        }

        if (title) event.title = title;
        if (date) event.date = formatDate(date);
        if (location) event.location = location;

        await event.save();

        res.status(200).json({ message: 'The event was altered successfully' });
    } catch (error) {
        console.error('Error updating event:', error);
        res.status(500).json({ message: 'Something went wrong. Please try again later' });
    }
}

async function getAllEvents(req, res) {
    try {
        const events = await Events.findAll();

        if (events.length === 0) {
            return res.status(404).json({ message: 'There are no events' });
        }

        res.status(200).json(events);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ message: 'Something went wrong. Please try again later' });
    }
}

async function getEvent(req, res) {
    const { eventId } = req.params;

    try {
        const event = await Events.findByPk(eventId);

        if (!event) {
            return res.status(404).json({ message: 'The event does not exist' });
        }

        res.status(200).json(event);
    } catch (error) {
        console.error('Error fetching event:', error);
        res.status(500).json({ message: 'Something went wrong. Please try again later' });
    }
}


async function addParticipant(req, res) {
    const { eventId } = req.params;
    const { alumniId } = req.body;

    try {
        const event = await Events.findByPk(eventId);
        if (!event) {
            return res.status(404).json({ message: 'The event you are trying to participate in does not exist' });
        }

        const alumni = await Alumni.findByPk(alumniId);
        if (!alumni) {
            return res.status(404).json({ message: 'The alumni does not exist' });
        }

        const existingParticipant = await AlumniEvents.findOne({
            where: {
                alumniId,
                eventId
            }
        });
        
        if (existingParticipant) {
            return res.status(400).json({ message: 'The alumni is already participating in the event' });
        }

        await AlumniEvents.create({
            alumniId,
            eventId
        });

        res.status(200).json({ message: 'Alumni successfully added to the event' });
    } catch (error) {
        console.error('Error adding alumni to event:', error);
        res.status(500).json({ message: 'Something went wrong. Please try again later' });
    }
}

async function removeParticipant(req, res) {
    const { eventId, alumniId } = req.params;

    try {
        const event = await Events.findByPk(eventId);
        if (!event) {
            return res.status(404).json({ message: 'The event does not exist' });
        }

        const alumni = await Alumni.findByPk(alumniId);
        if (!alumni) {
            return res.status(404).json({ message: 'The alumni does not exist' });
        }

        const participation = await AlumniEvents.findOne({
            where: {
                alumniId,
                eventId
            }
        });

        if (!participation) {
            return res.status(404).json({ message: 'The alumni is not participating in the event' });
        }

        await AlumniEvents.destroy({
            where: {
                alumniId,
                eventId
            }
        });

        res.status(200).json({ message: 'Alumni removed successfully' });
    } catch (error) {
        console.error('Error removing alumni from event:', error);
        res.status(500).json({ message: 'Something went wrong. Please try again later' });
    }
}

module.exports = { postEvent, updateEvent, getAllEvents, getEvent, addParticipant, removeParticipant};