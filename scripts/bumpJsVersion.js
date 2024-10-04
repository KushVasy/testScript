const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Define the JSP directory
const jspDirectory = 'src/main/jsp'; // Change this to your actual JSP folder

// Regular expression to match the JS file version
const jsVersionRegex = /(<script src="[^"]+\.js\?v=)(\d+\.\d+\.\d+)"/g;

// Increment the patch version
function incrementVersion(version) {
  let [major, minor, patch] = version.split('.').map(Number);
  patch += 1;
  return `${major}.${minor}.${patch}`;
}

// Process each JSP file
function processJspFile(filePath) {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(`Error reading file: ${filePath}`, err);
      return;
    }

    let updatedContent = data.replace(jsVersionRegex, (match, prefix, version) => {
      const newVersion = incrementVersion(version);
      return `${prefix}${newVersion}"`;
    });

    // Write updated content back to the file
    fs.writeFile(filePath, updatedContent, 'utf8', (err) => {
      if (err) {
        console.error(`Error writing file: ${filePath}`, err);
        return;
      }
      console.log(`Updated version in: ${filePath}`);
    });
  });
}

// Get all JSP files in the specified directory
glob(`${jspDirectory}/**/*.jsp`, (err, files) => {
  if (err) {
    console.error('Error finding JSP files', err);
    return;
  }

  files.forEach(processJspFile);
});
