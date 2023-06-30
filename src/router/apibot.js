const Router = require('express')
const controllerBot = require('../controller/bot')
const routes = new Router() 

// localhost:5000/apibot/me
routes.get('/me', controllerBot.me)
// localhost:5000/apibot/follow
routes.post('/follow', controllerBot.follow)
// localhost:5000/apibot/unfollow
routes.post('/unfollow', controllerBot.unfollow)
// localhost:5000/apibot/usersByUsernames
routes.post('/usersByUsernames', controllerBot.usersByUsernames)
// localhost:5000/apibot/usersByIds
routes.post('/usersByIds', controllerBot.usersByIds)
// localhost:5000/apibot/followings
routes.post('/followings', controllerBot.followings)
// localhost:5000/apibot/tweets
routes.post('/tweets', controllerBot.tweets)


module.exports = routes