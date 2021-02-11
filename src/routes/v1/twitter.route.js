const express = require('express');

const validate = require('../../middlewares/validate');
const twitterValidation = require('../../validations/auth.validation');
const twitterController = require('../../controllers/twitter.controller');

const router = express.Router();

router.get('/self', twitterController.getCurrentUser);
router.get('/mentioned-tweets', twitterController.getMentionedTweets);
router.get('/tweets', twitterController.getTweetsOfCurrentUser);
router.post('/postReplies', twitterController.postReplies);

module.exports = router;
