const express = require('express');
const helmet = require('helmet');
const path = require('path');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const cors = require('cors');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const httpStatus = require('http-status');
const { expressCspHeader, INLINE, SELF } = require('express-csp-header');
const config = require('./config/config');
const morgan = require('./config/morgan');
const { jwtStrategy, twitterStrategy } = require('./config/passport');
const { authLimiter } = require('./middlewares/rateLimiter');
const routes = require('./routes/v1');
const { errorConverter, errorHandler } = require('./middlewares/error');
const ApiError = require('./utils/ApiError');

const app = express();

if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// parse cookies to req.cookies
app.use(cookieParser());

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());
app.use(mongoSanitize());

// content security policy middleware
app.use(
  expressCspHeader({
    directives: {
      'default-src': [SELF, '*.twimg.com'],
      'script-src': [SELF, INLINE],
      'style-src': [SELF, INLINE],
      'img-src': [SELF, 'data:', '*.twimg.com'],
      'font-src': [SELF, 'fonts.gstatic.com'],
    },
  })
);

// gzip compression
app.use(compression());

// enable cors
const whitelist = ['http://localhost:3000', 'http://localhost:8080', 'https://rp-helpdesk.herokuapp.com'];
const corsOptions = {
  credentials: true,
  origin: (origin, callback) => {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};
app.use(cors(corsOptions));

// jwt authentication
app.use(passport.initialize());
passport.serializeUser(function (user, done) {
  done(null, user);
});
passport.deserializeUser(function (user, done) {
  done(null, user);
});
passport.use('jwt', jwtStrategy);
passport.use('twitter', twitterStrategy);

// limit repeated failed requests to auth endpoints
if (config.env === 'production' || process.env.NODE_ENV === 'staging') {
  app.use('/v1/auth', authLimiter);
}
app.use('/v1', routes);

app.use(express.static(path.join(__dirname, '../client/build')));
app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

// v1 api routes

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = app;
