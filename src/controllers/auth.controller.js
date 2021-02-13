const httpStatus = require('http-status');
const axios = require('axios');
const QS = require('querystring');
const { buildTokenCookie, applyCookies } = require('../utils/applyCookies');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService } = require('../services');
const Oauth1Helper = require('../utils/Oauth1Helper');
const config = require('../config/config');
const { default: convertToJson } = require('../utils/convertToJson');
const ApiError = require('../utils/ApiError');
const twitterService = require('../services/twitter.service');
const pick = require('../utils/pick');

const register = catchAsync(async (req, res) => {
  const user = await userService.createUser({ ...req.body, authType: 'credentials' });
  const tokens = await tokenService.generateAuthTokens(user);
  applyCookies(res, buildTokenCookie('jwt', tokens.access.token), buildTokenCookie('refreshToken', tokens.refresh.token));
  res.status(httpStatus.CREATED).send({ user });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  applyCookies(res, buildTokenCookie('jwt', tokens.access.token), buildTokenCookie('refreshToken', tokens.refresh.token));
  res.send({ user });
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.cookies.refreshToken);
  res.clearCookie('jwt');
  res.clearCookie('refresh');
  res.status(httpStatus.NO_CONTENT).send();
});

const check = catchAsync(async (req, res) => {
  try {
    const user = await userService.getUserById(req.user._id);
    const { data } = await twitterService(user.tokens.accessToken, user.tokens.tokenSecret).getCurrentUser();
    if (!data) throw new ApiError(httpStatus.BAD_REQUEST, 'Error while fetching the user details!');
    const userDetails = pick(data, [
      'name',
      'location',
      'description',
      'screen_name',
      'followers_count',
      'profile_image_url',
    ]);
    // convert mongodb object to js object
    return res.send({ user: { ...JSON.parse(JSON.stringify(user)), ...userDetails } });
  } catch (e) {
    console.log(e);
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid credentials');
  }
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.cookies.refreshToken);
  applyCookies(res, buildTokenCookie('jwt', tokens.access.token), buildTokenCookie('refreshToken', tokens.refresh.token));
  res.send({});
});

const getTwitterAccessToken = catchAsync(async (req, res, next) => {
  try {
    const request = {
      url: `https://api.twitter.com/oauth/access_token`,
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      query: {
        oauth_verifier: req.query.oauth_verifier,
        oauth_token: req.query.oauth_token,
      },
    };
    const response = await axios.post(`${request.url}?${QS.stringify(request.query)}`, request.body, {
      headers: request.headers,
    });
    const parsedBody = convertToJson(response.data);
    req.body = { ...req.body, ...parsedBody };
    next();
  } catch (e) {
    console.log(e);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error while fetching token!');
  }
});

const generateTokens = catchAsync(async (req, res) => {
  const tokens = await tokenService.generateAuthTokens(req.user);
  applyCookies(res, buildTokenCookie('jwt', tokens.access.token), buildTokenCookie('refreshToken', tokens.refresh.token));
  if (process.env.NODE_ENV === 'development') res.redirect('http://localhost:3000/d');
  else res.redirect(config.base_url);
});

const getTwitterRequestToken = catchAsync(async (req, res) => {
  try {
    const request = {
      url: 'https://api.twitter.com/oauth/request_token',
      method: 'POST',
      body: {
        oauth_callback: config.base_url,
      },
    };
    const authHeader = Oauth1Helper.getAuthHeaderForRequest(request);
    const response = await axios.post(request.url, request.body, { headers: authHeader });
    const parsedBody = convertToJson(response.data);
    return res.json(parsedBody);
  } catch (e) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error while fetching request token!');
  }
});

module.exports = {
  register,
  login,
  check,
  logout,
  refreshTokens,
  getTwitterAccessToken,
  getTwitterRequestToken,
  generateTokens,
};
