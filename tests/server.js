// tests/server.js
const app = require('../app'); // Import the main app.js file

const PORT = 3001; // Use port 3001 for testing
const server = app.listen(PORT, () => {
  console.log(`Test server is running on port ${PORT}`);
});

module.exports = server;
