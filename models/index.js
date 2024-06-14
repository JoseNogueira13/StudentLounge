const Alumni = require('./AlumniModel');
const Company = require('./CompanyModel');
const AlumniCompany = require('./AlumniCompanyModel');
const Events = require('./EventsModel');
const AlumniEvents = require('./AlumniEventsModel');
const Projects = require('./ProjectsModel');
const Chat = require('./ChatModel');
const Message = require('./MessageModel');
const Posts = require('./PostsModel');
const FavoritePosts = require('./FavoritePostsModel');

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
Alumni.hasMany(Chat, { foreignKey: 'alumniId' });
Chat.belongsTo(Alumni, { foreignKey: 'alumniId' });

// Alumni and Projects
Alumni.hasMany(Projects, { foreignKey: 'alumniId' });
Projects.belongsTo(Alumni, { foreignKey: 'alumniId' });

// Chats and Messages
Chat.hasMany(Message, { foreignKey: 'chatId' });
Message.belongsTo(Chat, { foreignKey: 'chatId' });

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
