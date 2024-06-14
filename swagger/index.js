const { alumniRegister } = require('./alumniSwagger');
const { alumniLogin } = require('./alumniSwagger');
const { alumniDeleteAccount } = require('./alumniSwagger');
const { alumniDeleteAlumni } = require('./alumniSwagger');

const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'API Documentation',
    version: '1.0.0',
    description: 'API documentation for all routes',
  },
  paths: {
    ...alumniRegister.paths,
    ...alumniLogin.paths,
    ...alumniDeleteAccount.paths,
    ...alumniDeleteAlumni.paths,
  },
  tags: [
    {
      name: 'alumni',
      description: 'Alumni related endpoints',
    },
  ],
};

module.exports = swaggerDocument;
