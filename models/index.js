const Alumni = require('./alumniModel.js');
const Company = require('./companyModel');
const AlumniCompany = require('./alumniCompanyModel');
const Events = require('./eventsModel');
const AlumniEvents = require('./alumniEventsModel');
const Projects = require('./projectsModel');
const Chat = require('./chatModel');
const Message = require('./messageModel');
const Posts = require('./postsModel');
const FavoritePosts = require('./favoritePostsModel');

// Alumni and AlumniCompany
Alumni.hasMany(AlumniCompany, { foreignKey: 'alumniId' });
AlumniCompany.belongsTo(Alumni, { foreignKey: 'alumniId' });

// Alumni and FavoritePosts
Alumni.hasMany(FavoritePosts, { foreignKey: 'alumniId' });
FavoritePosts.belongsTo(Alumni, { foreignKey: 'alumniId' });


// Alumni and AlumniEvents
Alumni.hasMany(AlumniEvents, { foreignKey: 'alumniId' });
AlumniEvents.belongsTo(Alumni, { foreignKey: 'alumniId' });

// Alumni and Chats
Alumni.hasMany(Chat, { as: 'alumniChats', foreignKey: 'alumniId' });
Chat.belongsTo(Alumni, { foreignKey: 'alumniId' });

// Alumni and Projects
Alumni.hasMany(Projects, { foreignKey: 'alumniId' });
Projects.belongsTo(Alumni, { foreignKey: 'alumniId' });

// Chats and Messages
Chat.hasMany(Message, { foreignKey: 'chatId' });
Message.belongsTo(Chat, { foreignKey: 'chatId' });

//companies and AlumniCompany
Company.hasMany(AlumniCompany, { foreignKey: 'companyId' });
AlumniCompany.belongsTo(Company, { foreignKey: 'companyId' });

//posts and FavoritePosts
Posts.hasMany(FavoritePosts, { foreignKey: 'postId' });
FavoritePosts.belongsTo(Posts, { foreignKey: 'postId' });

//events and AlumniEvents
Events.hasMany(AlumniEvents, { foreignKey: 'eventId' });
AlumniEvents.belongsTo(Events, { foreignKey: 'eventId' });

// alumni and messages
Alumni.hasMany(Message, { foreignKey: 'alumniId' });
Message.belongsTo(Alumni, { foreignKey: 'alumniId' });


// Export models
module.exports = {
  Alumni,
  Company,
  AlumniCompany,
  Events,
  AlumniEvents,
  Projects,
  Chat,
  Message,
  Posts,
  FavoritePosts
};
