const roles = ['organisation-member', 'organisation-admin'];

const roleRights = new Map();
roleRights.set(roles[0], ['getTweets', 'replyToTweets']);
roleRights.set(roles[1], ['getTweets', 'replyToTweets', 'getUsers', 'manageUsers']);

module.exports = {
  roles,
  roleRights,
};
