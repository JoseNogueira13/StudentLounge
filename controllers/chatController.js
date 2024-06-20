const { Chat, Alumni, Message } = require('../models');
const { Op } = require('sequelize');

async function createChat(req, res) {
    const { alumniId, recipientId } = req.body;

    try {
        const alumni = await Alumni.findByPk(alumniId);
        const recipient = await Alumni.findByPk(recipientId);

        if (!alumni || !recipient) {
            return res.status(404).json({ message: 'The alumni you are trying to chat with does not exist' });
        }

        const existingChat = await Chat.findOne({
            where: {
                [Op.or]: [
                    { alumniId, recipientId },
                    { alumniId: recipientId, recipientId: alumniId }
                ]
            }
        });

        if (existingChat) {
            return res.status(400).json({ message: 'A chat already exists between you and this alumni' });
        }

        await Chat.create({ alumniId, recipientId });

        res.status(200).json({ message: 'The chat was created successfully' });
    } catch (error) {
        console.error('Error creating chat:', error);
        res.status(500).json({ message: 'Something went wrong. Please try again later' });
    }
}


async function getChats(req, res) {
    const { alumniId } = req.params;


    try {
        const alumni = await Alumni.findByPk(alumniId);

        if (!alumni) {
            return res.status(404).json({ message: 'The alumni does not exist', alumniId: alumniId });
        }

        const chats = await Chat.findAll({
            where: {
                [Op.or]: [
                    { alumniId: alumniId },
                    { recipientId: alumniId }
                ]
            },
            include: [
                {
                    model: Alumni,
                    attributes: ['name', 'email']
                },
                {
                    model: Message,
                    limit: 1,
                    order: [['time', 'DESC']],
                    attributes: ['messageBody', 'time']
                }
            ]
        });

        res.status(200).json(chats);
    } catch (error) {
        console.error('Error getting chats:', error);
        res.status(500).json({ message: 'Something went wrong. Please try again later' });
    }
}


async function getMessages(req, res) {
    const { chatId } = req.params;

    try {
        const chat = await Chat.findByPk(chatId, {
            include: [
                {
                    model: Message,
                    attributes: ['messageId', 'messageBody', 'time'],
                }
            ]
        });

        if (!chat) {
            return res.status(404).json({ message: 'No messages were found' });
        }

        const messages = chat.Messages.map(message => ({
            messageId: message.messageId,
            messageBody: message.messageBody,
            time: message.time
        }));

        res.status(200).json(messages);
    } catch (error) {
        console.error('Error getting messages:', error);
        res.status(500).json({ message: 'Something went wrong. Please try again later' });
    }
}

async function createMessage(req, res) {
    const { chatId } = req.params;
    const { messageBody } = req.body;
    const { userId } = req.user;

    try {
        const chat = await Chat.findByPk(chatId);
        if (!chat) {
            return res.status(404).json({ message: 'The chat does not exist' });
        }

        if (!messageBody || messageBody.trim() === '') {
            return res.status(400).json({ message: 'Your message is empty' });
        }

        const newMessage = await Message.create({
            chatId,
            alumniId: userId,
            messageBody,
            time: new Date()
        });

        res.status(200).json({ message: 'Your message was sent successfully', newMessage});
    } catch (error) {
        console.error('Error creating message:', error);
        res.status(500).json({ message: 'Something went wrong. Please try again later' });
    }
}

async function deleteChat(req, res) {
    const { chatId } = req.params;

    try {
        const chat = await Chat.findByPk(chatId);

        if (!chat) {
            return res.status(404).json({ message: 'The chat does not exist' });
        }

        await chat.destroy();

        res.status(200).json({ message: 'The chat was deleted successfully' });
    } catch (error) {
        console.error('Error deleting chat:', error);
        res.status(500).json({ message: 'Something went wrong. Please try again later' });
    }
}


module.exports = { createChat, getChats, getMessages, createMessage, deleteChat };