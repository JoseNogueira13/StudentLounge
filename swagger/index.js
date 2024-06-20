const YAML = require('yamljs');
const path = require('path');
const fs = require('fs');

// Function to recursively load all YAML files from a given directory
const loadYAMLFiles = (dirPath) => {
  let paths = {};
  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    if (fs.lstatSync(filePath).isDirectory()) {
      // Recursively load YAML files from subdirectories
      paths = { ...paths, ...loadYAMLFiles(filePath) };
    } else if (file.endsWith('.yaml') || file.endsWith('.yml')) {
      const yamlContent = YAML.load(filePath);
      // Merge paths without overwriting existing ones
      for (const [pathKey, methods] of Object.entries(yamlContent.paths)) {
        if (!paths[pathKey]) {
          paths[pathKey] = {};
        }
        Object.assign(paths[pathKey], methods);
      }
    }
  });

  return paths;
};

// Load all YAML files from the 'swagger' directory
const alumniPaths = loadYAMLFiles(path.resolve(__dirname, './alumniSwagger'));
const companyPaths = loadYAMLFiles(path.resolve(__dirname, './companySwagger'));
const eventPaths = loadYAMLFiles(path.resolve(__dirname, './eventSwagger'));
const projectPaths = loadYAMLFiles(path.resolve(__dirname, './projectSwagger'));
const chatPaths = loadYAMLFiles(path.resolve(__dirname, './chatSwagger'));

const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'API Documentation',
    version: '1.0.0',
    description: 'API documentation for all routes',
  },
  paths: {
    ...alumniPaths,
    ...companyPaths,
    ...eventPaths,
    ...projectPaths,
    ...chatPaths
  },
  tags: [
    {
      name: 'alumni',
      description: 'Alumni related endpoints',
    },
    {
      name: 'companies',
      description: 'Company related endpoints',
    },
  ],
};

module.exports = swaggerDocument;
