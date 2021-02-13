const express = require('express');
const passport = require('passport');

const validate = require('../../middlewares/validate');
const authValidation = require('../../validations/auth.validation');
const authController = require('../../controllers/auth.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.post('/register', validate(authValidation.register), authController.register);
router.post('/login', validate(authValidation.login), authController.login);
router.post('/check', validate(authValidation.check), auth(), authController.check);
router.post('/logout', validate(authValidation.logout), authController.logout);
router.post('/refresh-tokens', validate(authValidation.refreshTokens), authController.refreshTokens);

router.get(
  '/twitter',
  authController.getTwitterAccessToken,
  passport.authenticate('twitter', { session: false }),
  authController.generateTokens
);
router.post('/twitter/reverse', authController.getTwitterRequestToken);

module.exports = router;
