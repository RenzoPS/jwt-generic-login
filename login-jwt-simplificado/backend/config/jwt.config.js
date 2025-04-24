const crypto = require('crypto');

let currentSecret = process.env.JWT_SECRET;

// Function to generate a new random secret
const generateNewSecret = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Rotate the JWT secret every 24 hours
setInterval(() => {
  currentSecret = generateNewSecret();
  console.log('JWT secret rotated successfully');
}, 24 * 60 * 60 * 1000);

const getSecret = () => currentSecret;

module.exports = { getSecret }; 