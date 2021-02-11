const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { twitterService } = require('../services');

const getCurrentUser = catchAsync(async function (req, res) {
  const { user } = req;
  const { data } = await twitterService(user.tokens.twitter_token, user.tokens.twitter_token_secret).getCurrentUser();
  if (!data) throw new ApiError(httpStatus.BAD_REQUEST, 'Error while fetching the user details!');
  const userDetails = pick(data, ['name', 'location', 'description', 'screen_name', 'followers_count']);
  return res.json(userDetails);
});

const getMentionedTweets = catchAsync(async function (req, res) {
  const { user } = req;
  const { data } = await twitterService(user.tokens.twitter_token, user.tokens.twitter_token_secret).mentionedTweets();
  return res.json(data);
});

const getTweetsOfCurrentUser = catchAsync(async function (req, res) {
  const { user } = req;
  const { data } = await twitterService(user.tokens.twitter_token, user.tokens.twitter_token_secret).userTimelineTweets();
  const tweetsOfCurrentUser = data.filter((tweet) => !tweet.in_reply_to_status_id);
  return res.json(tweetsOfCurrentUser);
});

const postReplies = catchAsync(async function (req, res) {
  const { user } = req;
  const args = pick(req.body, ['status', 'in_reply_to_status_id']);
  const { data } = await twitterService(user.tokens.twitter_token, user.tokens.twitter_token_secret).postReplies(args);
  return res.json(data);
});
module.exports = {
  getCurrentUser,
  getMentionedTweets,
  postReplies,
  getTweetsOfCurrentUser,
};
