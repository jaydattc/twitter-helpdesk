const moment = require('moment');
const config = require('../config/config');

const applyCookies = (res, ...cookies) =>
  cookies.forEach((cookieArgs) => Array.isArray(cookieArgs) && res.cookie(...cookieArgs));

const buildTokenCookie = (tokenType, token) => {
  switch (tokenType) {
    case 'jwt':
      return [
        'jwt',
        token,
        { httpOnly: true, expires: moment().add(config.jwt.accessExpirationMinutes, 'minutes').toDate() },
      ];
    case 'refreshToken':
      return [
        'refreshToken',
        token,
        { httpOnly: true, expires: moment().add(config.jwt.refreshExpirationDays, 'days').toDate() },
      ];
    default:
      return null;
  }
};
module.exports = { applyCookies, buildTokenCookie };
