const { Transform } = require('stream');
const crypto = require('crypto');

class DecryptStream extends Transform {
  constructor(key, iv) {
    super();
    this.decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  }

  _transform(chunk, encoding, callback) {
    try {
      const decrypted = this.decipher.update(chunk);
      this.push(decrypted);
      callback();
    } catch (err) {
      callback(err);
    }
  }

  _flush(callback) {
    try {
      const final = this.decipher.final();
      this.push(final);
      callback();
    } catch (err) {
      callback(err);
    }
  }
}

module.exports = DecryptStream;
