const Joi = require('joi');

const replyToTweet = {
  body: Joi.object().keys({
    status: Joi.string().required(),
    in_reply_to_status_id: Joi.string().required(),
  }),
};

module.exports = {
  replyToTweet,
};
