const Twit = require('twit');
const { config } = require('../config/config');

const _client = ({ token, secret }) =>
  new Twit({
    consumer_key: config.twitter.key,
    consumer_secret: config.twitter.secret,
    access_token: token,
    access_token_secret: secret,
    timeout_ms: 60 * 1000,
  });
module.exports = {
  getCurrentUser: (args) => _client.get('/account/verify_credentials', args),
  getTweets: (args) => _client.get('/search/tweets', args),
  getTweetStream: (args) => _client.stream('statuses/filter', args),
  getMentionedTweets: (args) => _client.get('/statuses/mentions_timeline', args),
  getUserTimelineTweets: (args) => _client.get('/statuses/user_timeline', args),
  getHomeTimelineTweets: (args) => _client.get('/statuses/home_timeline', args),
  postReplies: (args) => _client.post('/statuses/update', args),
};
