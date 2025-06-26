const express = require('express');
const path = require('path');
const dotenv = require('dotenv');

// Load .env file
dotenv.config();

const encryptRoute = require('./routes/encryptRoute');
const decryptRoute = require('./routes/decryptRoute');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static frontend
app.use(express.static(path.join(__dirname, '..', 'client')));

// Middleware to handle JSON (if needed)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Expose encrypted and decrypted file folders publicly
app.use('/backups', express.static(path.join(__dirname, 'backups')));
app.use('/restored', express.static(path.join(__dirname, 'restored')));

// Register routes
app.use('/encrypt', encryptRoute);
app.use('/decrypt', decryptRoute);

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
