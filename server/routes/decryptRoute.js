const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const { uploadDecrypt } = require('../middleware/upload');
const DecryptStream = require('../utils/decryptStream');
const { key, iv } = require('../utils/config');

router.post('/', uploadDecrypt.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No encrypted file uploaded' });
    }

    const originalName = req.file.originalname.replace('.gz.enc', '');
    const outputPath = path.join(__dirname, '..', 'restored', originalName);

    const decrypt = new DecryptStream(key, iv);
    const gunzip = zlib.createGunzip();
    const writeStream = fs.createWriteStream(outputPath);

    const stream = require('stream');
    const bufferStream = new stream.PassThrough();
    bufferStream.end(req.file.buffer);

    bufferStream
      .pipe(decrypt)
      .pipe(gunzip)
      .pipe(writeStream)
      .on('finish', () => {
        return res.status(200).json({
          message: '✅ File decrypted & restored successfully',
          file: originalName,
        });
      })
      .on('error', (err) => {
        console.error('❌ Stream error:', err);
        return res.status(500).json({ error: 'Decryption stream failed' });
      });

  } catch (err) {
    console.error('❌ Decrypt route error:', err);
    return res.status(500).json({ error: 'Decryption failed' });
  }
});


module.exports = router;
