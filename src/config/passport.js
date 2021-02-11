const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const TwitterTokenStrategy = require('passport-twitter-token');

const config = require('./config');
const { User } = require('../models');
const { tokenTypes } = require('./tokens');

const jwtOptions = {
  secretOrKey: config.jwt.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtVerify = async (payload, done) => {
  try {
    if (payload.type !== tokenTypes.ACCESS) {
      throw new Error('Invalid token type');
    }
    const user = await User.findById(payload.sub);
    if (!user) {
      return done(null, false);
    }
    done(null, user);
  } catch (error) {
    done(error, false);
  }
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

const twitterStrategy = new TwitterTokenStrategy(
  {
    consumerKey: config.twitter.key,
    consumerSecret: config.twitter.secret,
    includeEmail: true,
  },
  function (token, tokenSecret, profile, done) {
    User.upsertTwitterUser(token, tokenSecret, profile, function (err, user) {
      return done(err, user);
    });
  }
);

module.exports = { jwtStrategy, twitterStrategy };
