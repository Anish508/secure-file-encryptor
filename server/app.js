const express = require('express');
const path = require('path');
const dotenv = require('dotenv');


dotenv.config();

const encryptRoute = require('./routes/encryptRoute');
const decryptRoute = require('./routes/decryptRoute');

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.static(path.join(__dirname, '..', 'client')));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Expose encrypted and decrypted file folders publicly
app.use('/backups', express.static(path.join(__dirname, 'backups')));
app.use('/restored', express.static(path.join(__dirname, 'restored')));


app.use('/encrypt', encryptRoute);
app.use('/decrypt', decryptRoute);

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
