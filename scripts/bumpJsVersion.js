const fs = require('fs');
const path = require('path');
const glob = require('fast-glob');
const { execSync } = require('child_process');

console.log('Bumping JS version...');

// Define the JSP directory
const jspDirectory = 'src/main/jsp'; // Your JSP folder

// Regular expression to match the JS file version
const jsVersionRegex = /(<script src="[^"]*\/([^\/]+\.js)\?v=)(\d+\.\d+\.\d+)"/g;

// Increment the patch version
function incrementVersion(version) {
  let [major, minor, patch] = version.split('.').map(Number);
  patch += 1;
  return `${major}.${minor}.${patch}`;
}

// Process each JSP file
function processJspFile(filePath, modifiedFiles) {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.log(`Error reading file: ${filePath}`, err);
      return;
    }

    // Create a copy of data to modify
    let updatedContent = data;

    // Check for each modified file if it is in the JSP file
    modifiedFiles.forEach(modifiedFile => {
      const jsFileName = path.basename(modifiedFile);
      const regex = new RegExp(`(${jsFileName}\\?v=)(\\d+\\.\\d+\\.\\d+)`, 'g');

      updatedContent = updatedContent.replace(regex, (match, prefix, version) => {
        const newVersion = incrementVersion(version);
        return `${prefix}${newVersion}`; // Replace with new version
      });
    });

    // Write updated content back to the file only if changes are made
    if (data !== updatedContent) {
      fs.writeFile(filePath, updatedContent, 'utf8', (err) => {
        if (err) {
          console.log(`Error writing file: ${filePath}`, err);
          return;
        }
        console.log(`Updated version in: ${filePath}`);
      });
    } else {
      console.log(`No version change needed in: ${filePath}`);
    }
  });
}

// Get list of modified JavaScript files in the current commit
function getModifiedFiles() {
  try {
    const modifiedFiles = execSync('git diff --name-only HEAD~1 HEAD')
      .toString()
      .split('\n')
      .filter(file => file.endsWith('.js')); // Filter for JS files
    return modifiedFiles;
  } catch (error) {
    console.error('Error fetching modified files:', error);
    return [];
  }
}

// Main execution
const modifiedFiles = getModifiedFiles();
console.log('Modified JavaScript files:', modifiedFiles);

// Get all JSP files in the specified directory
glob(`${jspDirectory}/**/*.jsp`)
  .then(files => {
    console.log('Found JSP files:', files.length);
    files.forEach(file => processJspFile(file, modifiedFiles));
  })
  .catch(err => {
    console.error('Error finding JSP files:', err);
  });
