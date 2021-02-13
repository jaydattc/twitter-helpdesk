const mongoose = require('mongoose');
const tweetTypes = require('../config/tweetTypes');
const { toJSON } = require('./plugins');

// converted from https://transform.tools/json-to-mongoose
const tweetSchema = mongoose.Schema(
  {
    _id: {
      type: 'Number',
    },
    tweetType: {
      type: 'String',
      enum: Object.values(tweetTypes),
      default: tweetTypes.mentionedTweets,
    },
    created_at: {
      type: 'Date',
    },
    id: {
      type: 'Number',
      required: true,
    },
    id_str: {
      type: 'String',
    },
    text: {
      type: 'String',
    },
    truncated: {
      type: 'Boolean',
    },
    entities: {
      hashtags: {
        type: 'Array',
      },
      symbols: {
        type: 'Array',
      },
      user_mentions: {
        type: ['Mixed'],
      },
      urls: {
        type: 'Array',
      },
    },
    source: {
      type: 'String',
    },
    in_reply_to_status_id: {
      type: 'Number',
    },
    in_reply_to_status_id_str: {
      type: 'String',
    },
    in_reply_to_user_id: {
      type: 'Number',
    },
    in_reply_to_user_id_str: {
      type: 'String',
    },
    in_reply_to_screen_name: {
      type: 'String',
    },
    user: {
      id: {
        type: 'Number',
      },
      id_str: {
        type: 'String',
      },
      name: {
        type: 'String',
      },
      screen_name: {
        type: 'String',
      },
      location: {
        type: 'String',
      },
      description: {
        type: 'String',
      },
      url: {
        type: 'Mixed',
      },
      entities: {
        description: {
          urls: {
            type: 'Array',
          },
        },
      },
      protected: {
        type: 'Boolean',
      },
      followers_count: {
        type: 'Number',
      },
      friends_count: {
        type: 'Number',
      },
      listed_count: {
        type: 'Number',
      },
      created_at: {
        type: 'Date',
      },
      favourites_count: {
        type: 'Number',
      },
      utc_offset: {
        type: 'Mixed',
      },
      time_zone: {
        type: 'Mixed',
      },
      geo_enabled: {
        type: 'Boolean',
      },
      verified: {
        type: 'Boolean',
      },
      statuses_count: {
        type: 'Number',
      },
      lang: {
        type: 'Mixed',
      },
      contributors_enabled: {
        type: 'Boolean',
      },
      is_translator: {
        type: 'Boolean',
      },
      is_translation_enabled: {
        type: 'Boolean',
      },
      profile_background_color: {
        type: 'String',
      },
      profile_background_image_url: {
        type: 'Mixed',
      },
      profile_background_image_url_https: {
        type: 'Mixed',
      },
      profile_background_tile: {
        type: 'Boolean',
      },
      profile_image_url: {
        type: 'String',
      },
      profile_image_url_https: {
        type: 'String',
      },
      profile_banner_url: {
        type: 'String',
      },
      profile_link_color: {
        type: 'String',
      },
      profile_sidebar_border_color: {
        type: 'String',
      },
      profile_sidebar_fill_color: {
        type: 'String',
      },
      profile_text_color: {
        type: 'String',
      },
      profile_use_background_image: {
        type: 'Boolean',
      },
      has_extended_profile: {
        type: 'Boolean',
      },
      default_profile: {
        type: 'Boolean',
      },
      default_profile_image: {
        type: 'Boolean',
      },
      following: {
        type: 'Boolean',
      },
      follow_request_sent: {
        type: 'Boolean',
      },
      notifications: {
        type: 'Boolean',
      },
      translator_type: {
        type: 'String',
      },
    },
    geo: {
      type: 'Mixed',
    },
    coordinates: {
      type: 'Mixed',
    },
    place: {
      type: 'Mixed',
    },
    contributors: {
      type: 'Mixed',
    },
    is_quote_status: {
      type: 'Boolean',
    },
    retweet_count: {
      type: 'Number',
    },
    favorite_count: {
      type: 'Number',
    },
    favorited: {
      type: 'Boolean',
    },
    retweeted: {
      type: 'Boolean',
    },
    lang: {
      type: 'String',
    },
  },
  {
    _id: false,
    strict: false,
  }
);

// add plugin that converts mongoose to json
tweetSchema.plugin(toJSON);

tweetSchema.statics.getLastTweet = async function () {
  const Tweet = this;
  const latestTweet = await Tweet.find().sort({ id: -1 }).limit(1);
  return latestTweet[0];
};

tweetSchema.statics.bulkTweetUpsert = async function (tweets) {
  if (tweets.length > 0) {
    const Tweet = this;
    const bulkOps = tweets.map((tweet) => ({
      updateOne: {
        filter: { _id: tweet.id },
        update: { $setOnInsert: { _id: tweet.id, ...tweet } },
        upsert: true,
      },
    }));
    // bulkWrite the tweets
    try {
      const bulkWriteOpResult = await Tweet.collection.bulkWrite(bulkOps);
      return bulkWriteOpResult;
    } catch (err) {
      console.log('BULK tweets update error!');
    }
  }
};

tweetSchema.pre('save', function (next) {
  const tweet = this;
  tweet._id = tweet.id;
  next();
});

/**
 * @typedef Tweet
 */
const Tweet = mongoose.model('Tweet', tweetSchema);

module.exports = Tweet;
