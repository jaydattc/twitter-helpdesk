const crypto = require('crypto');
const oauth1a = require('oauth-1.0a');
const config = require('../config/config');

const CONSUMERKEY = config.twitter.key;
const CONSUMERSECRET = config.twitter.secret;

class Oauth1Helper {
  static getAuthHeaderForRequest(request) {
    const oauth = oauth1a({
      consumer: { key: CONSUMERKEY, secret: CONSUMERSECRET },
      signature_method: 'HMAC-SHA1',
      hash_function(baseString, key) {
        return crypto.createHmac('sha1', key).update(baseString).digest('base64');
      },
    });

    const authorization = oauth.authorize(request);

    return oauth.toHeader(authorization);
  }
}

module.exports = Oauth1Helper;
