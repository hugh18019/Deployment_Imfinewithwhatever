const jwt = require('jsonwebtoken');
const getDevEnvironment = require('../utils/GetDevEnvironment.js');

function setAccessToken(ctx, email) {
  // console.log('setAccessToken:: cookie = ', ctx.cookies.get('access_token'));
  // console.log('setAccessToken:: ctx.state contains', ctx.state);

  // Create an expiration date 20 minutes in the future for the user's access_token *cookie*
  // const exp_date = Date.now() + 40 * 60 * 1000;

  const exp_date = Data.now() + 40 * 60

  let token_opts = {
    type: 'web',
    exp: Math.floor(exp_date / 1000 + 60 * 1), // expire the access_token 1m after the cookie
    user: email,
  };

  // Sign the access_token
  const access_token = jwt.sign(token_opts, process.env.JWT_KEY);

  // Provide the access_token to the user via a cookie
  ctx.cookies.set('access_token', access_token, {
    httpOnly: true,
    secure: getDevEnvironment() ? false : true,
    expires: new Date(exp_date),
    //domain: process.env.APP_DOMAIN
  });
  ctx.cookies.set("email", email)

  return access_token
}

module.exports = setAccessToken;
