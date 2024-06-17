const { sequelize } = require('./db/conn');
const models = require('./models');
const bcrypt = require('bcrypt');


async function resetDatabase() {
    try {
        await sequelize.sync({ force: true });
        
        const alumniData = [
        {username: 'alumni1', password: 'password1', studentNumber: '12345678', email: 'alumni1@gmail.com', name: 'Alumni 1', experiencePoints: 267, level: '4', currentProfession: 'Software Developer', skills: 'Java, Python, C++', isAdmin: true},
        {username: 'alumni2', password: 'password2', studentNumber: '12345679', email: 'alumni2@gmail.com', name: 'Alumni 2', experiencePoints: 26, level: '1', currentProfession: 'designer', skills: 'blender', isAdmin: false},
        {username: 'alumni3', password: 'password3', studentNumber: '12345670', email: 'alumni3@gmail.com', name: 'Alumni 3', experiencePoints: 200, level: '3', currentProfession: 'project manager', skills: 'Java', isAdmin: false},
    ];

    const hashedAlumniData = await Promise.all(alumniData.map(async (alumni) => {
        const hashedPassword = await bcrypt.hash(alumni.password, 10);
        return { ...alumni, password: hashedPassword };
    }));

    await models.Alumni.bulkCreate(hashedAlumniData);

        await models.Company.bulkCreate([
        {name: 'company1', type: 'front-end' ,location: 'Lisbon', startingDate: new Date(), finishingDate: new Date()},
        {name: 'company2', type: 'back-end' ,location: 'Porto', startingDate: new Date(), finishingDate: new Date()},
        {name: 'company3', type: 'design' ,location: 'Aveiro', startingDate: new Date()},
    ]);
        await models.AlumniCompany.bulkCreate([
        {alumniId: 1, companyId: 3, startDate: new Date(), endDate: new Date()},
        {alumniId: 2, companyId: 2, startDate: new Date(), endDate: new Date()},
        {alumniId: 1, companyId: 1, startDate: new Date(), endDate: new Date()},
    ]);
        await models.Events.bulkCreate([
        {title: 'Workshop',date: new Date(), location: 'b108'},
        {title: 'Seminar', date: new Date(), location: 'b202'},
        {title: 'Conference', date: new Date(), location: 'Auditório'},
    ]);
        await models.AlumniEvents.bulkCreate([
        {alumniId: 1, eventId: 1},
        {alumniId: 2, eventId: 2},
        {alumniId: 1, eventId: 3},
    ]);
        await models.Projects.bulkCreate([
        {alumniId: 1, title: 'Project 1', description: 'Project 1 description', url: 'this is an url'},
        {alumniId: 2, title: 'Project 2', description: 'Project 2 description', url: 'this is another url'},
        {alumniId: 1, title: 'Project 3', description: 'Project 3 description', url: 'this is another url times two'},
    ]);
        await models.Chat.bulkCreate([
        {alumniId: 1, recipientId: 2},
        {alumniId: 2, recipientId: 1},
        {alumniId: 1, recipientId: 3},
    ]);
        await models.Message.bulkCreate([
        {chatId: '1', messageBody: 'Hello, how are you?', time: new Date()},
        {chatId: '1', messageBody: 'I am fine, thank you', time: new Date()},
        {chatId: '3', messageBody: 'Hello, how are you?', time: new Date()},
        {chatId: '2', messageBody: 'I am fine, thank you', time: new Date()},
    ]);  
        await models.Posts.bulkCreate([
        {alumniId: 1, title: 'Post 1', postBody: 'Post 1 content', image: 'this is an url'},
        {alumniId: 2, title: 'Post 2', postBody: 'Post 2 content', image: 'this is another url'},
        {alumniId: 1, title: 'Post 3', postBody: 'Post 3 content', image: 'this is another url times two'},
        ]);
        await models.FavoritePosts.bulkCreate([
        {alumniId: 1, postId: 1},
        {alumniId: 2, postId: 2},
        {alumniId: 1, postId: 3},
        ]);
        
  
      console.log('Database reset successfully');
    } catch (error) {
      console.error('Error resetting database:', error);
    }
}

resetDatabase();