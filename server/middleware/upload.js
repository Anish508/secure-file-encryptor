const multer = require('multer');

const storage = multer.memoryStorage();

// ✅ For encryption – allow only images and text files
const encryptFilter = (req, file, cb) => {
  if (
    file.mimetype.startsWith('image/') ||
    file.mimetype === 'text/plain' ||
    file.mimetype === 'application/octet-stream'
  ) {
    cb(null, true);
  } else {
    cb(new Error('Only text and image files are allowed'));
  }
};

// ✅ For decryption – allow all files
const decryptFilter = (req, file, cb) => {
  cb(null, true);
};

const uploadEncrypt = multer({ storage, fileFilter: encryptFilter });
const uploadDecrypt = multer({ storage, fileFilter: decryptFilter });

module.exports = {
  uploadEncrypt,
  uploadDecrypt
};
