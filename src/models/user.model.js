const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const httpStatus = require('http-status');

const { toJSON, paginate } = require('./plugins');
const { roles } = require('../config/roles');
const ApiError = require('../utils/ApiError');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    password: {
      type: String,
      trim: true,
      minlength: 8,
      validate(value) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error('Password must contain at least one letter and one number');
        }
      },
      private: true, // used by the toJSON plugin
    },
    role: {
      type: String,
      enum: roles,
      default: 'organisation-member',
    },
    tokens: {
      accessToken: { type: String, private: true },
      tokenSecret: { type: String, private: true },
    },
    twitter: {
      id: String,
      profile_url: String,
    },
    organisation: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Organisation',
    },
    picture: String,
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};
userSchema.statics.isTwitterTaken = async function (twitter, excludeUserId) {
  const user = await this.findOne({ twitter, _id: { $ne: excludeUserId } });
  return !!user;
};

userSchema.statics.upsertTwitterUser = async function (token, tokenSecret, profile, cb) {
  const user = await this.findOne({
    'twitter.id': profile.id_str,
  });
  // no user was found, lets create a new one
  if (!user) {
    const newUser = new this({
      email: `${profile.username}@twitter.com`,
      twitter: { id: profile.id_str, screen_name: profile._json.screen_name, profile_url: profile._json.url },
      name: profile.displayName,
      tokens: {
        accessToken: token,
        tokenSecret,
      },
    });
    newUser.save(function (error, savedUser) {
      if (error) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error while saving details!');
      }
      return cb(error, savedUser);
    });
  } else {
    return cb(undefined, user);
  }
};

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

/**
 * @typedef User
 */
const User = mongoose.model('User', userSchema);

module.exports = User;
