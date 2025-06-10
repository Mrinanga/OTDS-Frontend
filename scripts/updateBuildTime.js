const fs = require('fs');
const path = require('path');

// Read the current systemInfo.js
const systemInfoPath = path.join(__dirname, '../src/config/systemInfo.js');
let content = fs.readFileSync(systemInfoPath, 'utf8');

// Get current timestamp in local timezone
const now = new Date();
const year = now.getFullYear();
const month = String(now.getMonth() + 1).padStart(2, '0');
const day = String(now.getDate()).padStart(2, '0');
const hours = String(now.getHours()).padStart(2, '0');
const minutes = String(now.getMinutes()).padStart(2, '0');
const seconds = String(now.getSeconds()).padStart(2, '0');

const buildTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

// Replace the lastUpdate value
content = content.replace(
  /lastUpdate: .*?,/,
  `lastUpdate: '${buildTime}',`
);

// Write back to the file
fs.writeFileSync(systemInfoPath, content);

console.log('Build time updated successfully!'); 