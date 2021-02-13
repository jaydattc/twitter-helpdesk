const roles = ['organisation-member', 'organisation-admin'];

const roleRights = new Map();
roleRights.set(roles[0], ['getTweets', 'replyTweets']);
roleRights.set(roles[1], ['getTweets', 'replyTweets', 'getUsers', 'manageUsers']);

module.exports = {
  roles,
  roleRights,
};
