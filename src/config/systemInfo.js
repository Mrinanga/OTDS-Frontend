// src/config/systemInfo.js
import packageJson from '../../package.json';

// During development, these values will be read from package.json
// After build, these values will be included in the bundle
const systemInfo = {
  systemName: process.env.NODE_ENV === 'development' ? packageJson.name : 'OTDS Courier Service',
  systemVersion: process.env.NODE_ENV === 'development' ? packageJson.version : '1.0.0',
  lastUpdate: '2024-03-19 12:00:00' // This will be updated during build
};

// Freeze the object to prevent modifications
Object.freeze(systemInfo);

export default systemInfo; 