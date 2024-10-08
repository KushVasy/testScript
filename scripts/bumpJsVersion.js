const fs = require('fs');
const path = require('path');
const glob = require('fast-glob');
const winston = require('winston');

console.log('Bumping JS version...');
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level}] ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'bump-js-version.log' })
  ]
});

// Define the JSP directory
const jspDirectory = 'src/main/jsp'; // Your JSP folder

// Regular expression to match the JS file version
const jsVersionRegex = /(<script\s+src="[^"]+\.js\?v=)(\d+\.\d+\.\d+)"/g;

// Increment the patch version
function incrementVersion(version) {
  console.log('Incrementing version');
  let [major, minor, patch] = version.split('.').map(Number);
  patch += 1;
  return `${major}.${minor}.${patch}`;
}

// Process each JSP file
function processJspFile(filePath) {
  console.log(`Processing file: ${filePath}`);
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      logger.error(`Error reading file: ${filePath}`, err);
      return;
    }

    let updatedContent = data.replace(jsVersionRegex, (match, prefix, version) => {
      const newVersion = incrementVersion(version);
      return `${prefix}${newVersion}"`;
    });

    // Write updated content back to the file only if changes are made
    if (data !== updatedContent) {
      fs.writeFile(filePath, updatedContent, 'utf8', (err) => {
        if (err) {
          logger.error(`Error writing file: ${filePath}`, err);
          return;
        }
        logger.info(`Updated version in: ${filePath}`);
      });
    } else {
      logger.info(`No version change needed in: ${filePath}`);
    }
  });
}

// Get all JSP files in the specified directory
glob(`${jspDirectory}/**/*.jsp`, (err, files) => {
  console.log('Finding JSP files...');
  if (err) {
    logger.error('Error finding JSP files', err);
    return;
  }

  files.forEach(processJspFile);
});
