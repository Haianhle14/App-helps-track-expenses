const crypto = require('crypto');

const hashDeviceId = (userAgent) => {
  return crypto.createHash('sha256').update(userAgent).digest('hex');
};

module.exports = { hashDeviceId };
