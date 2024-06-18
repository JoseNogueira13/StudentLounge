const { Events } = require('../models');
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

module.exports = { postEvent };