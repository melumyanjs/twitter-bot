const botClient = require('../service/bot/botClient')

class BotController {

    async me (req, res, next) {
        try{
            const data = await botClient.me()
            return res.json(data)
        }catch(e){
            return next(e)
        }
    }
    
    async follow (req, res, next) {
        try{
            const data = await botClient.follow(req.body.loggedUserId, req.body.targetUserId)
            return res.json(data)
        }catch(e){
            return next(e)
        }
    }

    async unfollow (req, res, next) {
        try{
            const data = await botClient.unfollow(req.body.loggedUserId, req.body.targetUserId)
            return res.json(data)
        }catch(e){
            return next(e)
        }
    }
    
    async usersByUsernames (req, res, next) {
        try{
            const data = await botClient.usersByUsernames(req.body.usernames)
            return res.json(data)
        }catch(e){
            return next(e)
        }
    }

    async usersByIds (req, res, next) {
        try{
            const data = await botClient.usersByIds(req.body.userIds)
            return res.json(data)
        }catch(e){
            return next(e)
        }
    }
    
    async followings(req, res, next){
        try{
            const data = await botClient.followings(req.body.userId)
            return res.json(data)
        }catch(e){
            return next(e)
        }
    }

    async tweets(req, res, next){
        try{
            const data = await botClient.tweets(req.body.userId, req.body.option)
            return res.json(data)
        }catch(e){
            return next(e)
        }
    }
}

module.exports = new BotController()