const { TwitterApi } = require("twitter-api-v2");
const { twitterOAuth2 } = require("twitter-oauth2");

const client = new TwitterApi({
  appKey: process.env.API_KEY,
  appSecret: process.env.API_SECRET,
  accessToken: process.env.ACCESS_TOKEN,
  accessSecret: process.env.ACCESS_SECRET,
});

const bearer = new TwitterApi(process.env.BEARER_TOKEN);

const OAuth2 = new twitterOAuth2({
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    redirect_uri: process.env.REDIRECT_URI,
    scope: 'tweet.read users.read offline.access'
})

module.exports = {client, bearer,OAuth2}