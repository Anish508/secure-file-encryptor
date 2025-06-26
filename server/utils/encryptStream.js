const { Transform } = require('stream');
const crypto = require('crypto');

class EncryptStream extends Transform {
  constructor(key, iv) {
    super();
    this.cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  }

  _transform(chunk, encoding, callback) {
    try {
      const encrypted = this.cipher.update(chunk);
      this.push(encrypted);
      callback();
    } catch (err) {
      callback(err);
    }
  }

  _flush(callback) {
    try {
      const final = this.cipher.final();
      this.push(final);
      callback();
    } catch (err) {
      callback(err);
    }
  }
}

module.exports = EncryptStream;
