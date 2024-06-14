const YAML = require('yamljs');
const path = require('path');

const alumniRegister = YAML.load(path.resolve(__dirname, 'alumniRegister.yaml'));
const alumniLogin = YAML.load(path.resolve(__dirname, 'alumniLogin.yaml'));
const alumniDeleteAccount = YAML.load(path.resolve(__dirname, 'alumniDeleteAccount.yaml'));
const alumniDeleteAlumni = YAML.load(path.resolve(__dirname, 'alumniDeleteAlumni.yaml'));

module.exports = {
  alumniRegister,
  alumniLogin,
  alumniDeleteAccount,
  alumniDeleteAlumni
};
