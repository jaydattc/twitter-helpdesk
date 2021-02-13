const express = require('express');

const validate = require('../../middlewares/validate');
const twitterValidation = require('../../validations/twitter.validation');
const twitterController = require('../../controllers/twitter.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.get('/profile', auth('getTweets'), twitterController.getCurrentUser);
router.get('/tweets', auth('getTweets'), twitterController.getTweets);
router.post(
  '/reply',
  auth('getTweets', 'replyTweets'),
  validate(twitterValidation.replyToTweet),
  twitterController.replyToTweet
);

module.exports = router;
