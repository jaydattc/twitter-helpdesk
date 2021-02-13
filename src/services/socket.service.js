/* eslint-disable camelcase */
const Twit = require('twit');
const jwt = require('jsonwebtoken');
const parseCookie = require('cookie').parse;
const config = require('../config/config');
const { User } = require('../models');
const Tweet = require('../models/tweet.model');
const tweetTypes = require('../config/tweetTypes');

const createTwitClient = (key, secret) =>
  new Twit({
    consumer_key: config.twitter.key,
    consumer_secret: config.twitter.secret,
    timeout_ms: 60 * 1000,
    access_token: key,
    access_token_secret: secret,
  });

module.exports = (io) => {
  io.on('connection', (socket) => {
    const getTokens = () => parseCookie(socket.request.headers.cookie || socket.handshake.headers.cookie);

    socket.on('register_screen_name', async (data) => {
      const { screen_name } = data;
      try {
        const tokens = getTokens();
        const decoded = jwt.decode(tokens.jwt, config.jwt.secret);
        const user = await User.findById(decoded.sub);
        if (decoded && user) {
          socket.join(screen_name);
          const twitter = createTwitClient(user.tokens.accessToken, user.tokens.tokenSecret);
          const twitStream = twitter.stream('statuses/filter', {
            track: `@${screen_name}`,
          });
          twitStream.on('tweet', async (tweet) => {
            if (!tweet.text.includes('RT')) {
              const bulkOps = await Tweet.bulkTweetUpsert([
                { ...tweet, tweetType: tweet.in_reply_to_status_id ? tweetTypes.userReplies : tweetTypes.mentionedTweets },
              ]);
              if (bulkOps.upsertedCount === 1) {
                const _tweet = await Tweet.findById(tweet.id.toString());
                io.to(screen_name).emit('tweets', _tweet);
              }
            }
          });
        }
      } catch (e) {
        io.to(screen_name).emit('error', { message: 'Token expired!', status: 401 });
      }
    });
  });
};
