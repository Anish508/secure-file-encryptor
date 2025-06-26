const crypto = require('crypto');

// These values should ideally come from process.env or a secure vault
const key = crypto
  .createHash('sha256')
  .update('my_super_secret_key') // Replace with your own passphrase
  .digest();

const iv = Buffer.alloc(16, 0); // 16-byte IV filled with 0s

module.exports = { key, iv };
