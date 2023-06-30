const botClient = require('../service/bot/botClient')

class NavController {
    async viewIndex (req, res, next) {
        try {
            const data = await botClient.me()
           
            return res.render("index", {
                name: data.name,
                username: data.username,
                id: data.id,
            })
        } catch(e) {
            return next(e)
        }
    }
}

module.exports = new NavController()