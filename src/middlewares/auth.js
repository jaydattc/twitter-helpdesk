const passport = require('passport');
const httpStatus = require('http-status');
const jwt = require('jsonwebtoken');

const ApiError = require('../utils/ApiError');
const { roleRights } = require('../config/roles');
const { refreshAuth } = require('../services/auth.service');
const { buildTokenCookie, applyCookies } = require('../utils/applyCookies');
const { User } = require('../models');
const config = require('../config/config');

const verifyCallback = (req, resolve, reject, requiredRights, res) => async (err, user, info) => {
  const rejectAuth = () => {
    if (req.cookies.jwt || req.cookies.refresh) {
      res.clearCookie('jwt');
      res.clearCookie('refresh');
    }
    return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Invalid or expired user credentials! Please log in again.'));
  };

  if (err || info || !user) {
    // refresh token if jwt expires and refresh is available
    if (req.cookies.refreshToken) {
      try {
        const newTokens = await refreshAuth(req.cookies.refreshToken);
        applyCookies(
          res,
          buildTokenCookie('jwt', newTokens.access.token),
          buildTokenCookie('refreshToken', newTokens.refresh.token)
        );
        const payload = jwt.verify(newTokens.access.token, config.jwt.secret);
        const _user = await User.findById(payload.sub);
        req.user = _user;
      } catch (e) {
        return rejectAuth();
      }
    } else return rejectAuth();
  }
  req.user = user;

  if (requiredRights.length) {
    const userRights = roleRights.get(user.role);
    const hasRequiredRights = requiredRights.every((requiredRight) => userRights.includes(requiredRight));
    if (!hasRequiredRights && req.params.userId !== user.id) {
      return reject(new ApiError(httpStatus.FORBIDDEN, 'This action is forbidden for you!'));
    }
  }
  resolve();
};

const auth = (...requiredRights) => async (req, res, next) => {
  return new Promise((resolve, reject) => {
    passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject, requiredRights, res))(
      req,
      res,
      next
    );
  })
    .then(() => next())
    .catch((err) => next(err));
};

module.exports = auth;
