const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { twitterService } = require('../services');
const { Tweet } = require('../models');
const tweetTypes = require('../config/tweetTypes');

const getCurrentUser = catchAsync(async function (req, res) {
  const { user } = req;
  const { data } = await twitterService(user.tokens.accessToken, user.tokens.tokenSecret).getCurrentUser();
  if (!data) throw new ApiError(httpStatus.BAD_REQUEST, 'Error while fetching the user details!');
  const userDetails = pick(data, ['name', 'location', 'description', 'screen_name', 'followers_count']);
  return res.json(userDetails);
});

const getTweets = catchAsync(async function (req, res) {
  const { user } = req;

  const mentionedTimelineParams = { count: 100 };
  const lastMentionedTweet = await Tweet.getLastTweet({ tweetType: tweetTypes.mentionedTweets });
  if (lastMentionedTweet) mentionedTimelineParams.since_id = lastMentionedTweet._id;
  const { data: mentionedTweets } = await twitterService(
    user.tokens.accessToken,
    user.tokens.tokenSecret
  ).getMentionedTweets(mentionedTimelineParams);

  const userTweetsParams = { count: 100, exclude_replies: 5 };
  const lastTweet = await Tweet.getLastTweet({ tweetType: tweetTypes.mentionedTweets });
  if (lastTweet) userTweetsParams.since_id = lastTweet._id;

  const { data: _userTweets } = await twitterService(user.tokens.accessToken, user.tokens.tokenSecret).getUserTimelineTweets(
    userTweetsParams
  );
  const userTweets = _userTweets.filter((tweet) => tweet.in_reply_to_status_id !== null);
  const allTweets = [
    ...mentionedTweets.map((tweet) => ({ tweetType: tweetTypes.mentionedTweets, ...tweet })),
    ...userTweets.map((tweet) => ({ tweetType: tweetTypes.userReplies, ...tweet })),
  ];
  await Tweet.bulkTweetUpsert(allTweets);
  const allTweetReplies = await Tweet.find({}).sort({ _id: -1 });

  return res.json(allTweetReplies);
});

const replyToTweet = catchAsync(async function (req, res) {
  const { user } = req;
  const args = pick(req.body, ['status', 'in_reply_to_status_id']);
  const { data } = await twitterService(user.tokens.accessToken, user.tokens.tokenSecret).replyToTweet(args);
  return res.json(data);
});

module.exports = {
  getCurrentUser,
  replyToTweet,
  getTweets,
};
