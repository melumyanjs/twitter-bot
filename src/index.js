require('dotenv').config({path: __dirname + '/.config/.env'})
const app = require('./app')
let server = null
const botClient = require('./service/bot/botClient')

const PORT = process.env.PORT || 5000


async function start () {
    try {
        server = await app.listen(PORT, () => console.log(`Server has been started on ${PORT} ...`))
        console.log(`Twitter bot has been started`)
        botClient.start()
    } catch(e){
        console.log(e)
        stop()
        start()
    }
}

async function stop() {
    try {
        await server.close(() => console.log(`Server was stopped`))
        console.log(`Twitter bot was stopped`)
        botClient.stop()
    } catch(e){
        console.log(e)
    } finally {
        process.exit(0)
    }
}

start()

// Прерывание термина с клавиатуры
process.on("SIGINT", stop)
// Сигнал завершения
process.on("SIGTERM", stop)
// Обнаружено зависание на управляющем терминале или смерть процесса управления
process.on("SIGHUP", stop)

