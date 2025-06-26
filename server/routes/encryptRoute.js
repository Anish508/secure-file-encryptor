const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const { uploadEncrypt } = require('../middleware/upload');
const EncryptStream = require('../utils/encryptStream');
const { key, iv } = require('../utils/config');

router.post('/', uploadEncrypt.single('file'), (req, res) => {
  try {
    if (!req.file) return res.status(400).send('No file uploaded');

    const originalName = req.file.originalname;
    const outputPath = path.join(__dirname, '..', 'backups', originalName + '.gz.enc');

    const gzip = zlib.createGzip();
    const encrypt = new EncryptStream(key, iv);
    const writeStream = fs.createWriteStream(outputPath);

    // Pipe file buffer → gzip → encrypt → file
    const stream = require('stream');
    const bufferStream = new stream.PassThrough();
    bufferStream.end(req.file.buffer);

    bufferStream.pipe(gzip).pipe(encrypt).pipe(writeStream).on('finish', () => {
      res.status(200).json({
        message: '✅ File encrypted & backed up successfully',
        file: originalName + '.gz.enc',
        download: `/download/${originalName + '.gz.enc'}`,
      });
    });

  } catch (err) {
    console.error(err);
    res.status(500).send('Encryption failed');
  }
});

module.exports = router;
