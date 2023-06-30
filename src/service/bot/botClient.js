const mediafileService = require("../mediafile");
const fileManager = require("../../utils/fileManager");
const {replaceKeyInObjectArray, leadToTheSchemeTwitterPost} = require("../../utils/transformData");
const ApiTwitter = require("./apiTwitter");
const Broker = require("../broker");
const { DateUtil } = require("../../utils/date");

class BotClient {

  constructor() {
    this.api = new ApiTwitter();
    this.broker = new Broker(`amqp://${process.env.RABBIT_USER}:${process.env.RABBIT_PASSWORD}@${process.env.RABBIT_HOST}`)
    this.queueName = process.env.RABBIT_QUEUE_NAME;
    this._replaceMap =  {
      "title" : "title",
      "created_at" : "date",
      "id" : "href",
      "edit_history_tweet_ids" : "desc",
      "text" : "content",
      "author_id" : "agency"
    }
  }

  async me() {
    return this.api.me();
  }

  async follow(loggedUserId, targetUserId) {
    // TODO
    // Добавить выгрузку предыдущих N новостей
    // отправка новых новостей в RabitMQ
    
    return this.api.follow(loggedUserId, targetUserId);
  }

  async unfollow(loggedUserId, targetUserId) {
    return this.api.unfollow(loggedUserId, targetUserId);
  }

  async usersByUsernames(usernames) {
    return this.api.usersByUsernames(usernames);
  }

  async usersByIds(userIds) {
    return this.api.usersByIds(userIds);
  }

  async followings(userId) {
    return this.api.followings(userId);
  }

  async tweets(userId, { max = null, start_time = null, end_time = null }) {
    let body
    if(start_time && end_time)
      body = await this.api.tweetsT(userId, start_time, end_time);
    else
      body = await this.api.tweetsN(userId, max);
    
    let users =  await this.usersByIds(userId)
    body.data = this.__standardization(body.data, users[0])

    return body
  }

  async savePosts(date_start = DateUtil.Date(-1), date_end = DateUtil.Date()){
    let historyTwits = await this.api.reverse_chronological(date_start, date_end)
    if(!historyTwits)
      return

    let user =  await this.me()
    let data = await this.standardization(historyTwits, user)
    //fileManager.Write(data, "data.log.json")
    // сохранение медиафайлов
    mediafileService.saveMediaFrom(data)

    fileManager.Write(payload, `${date_start}-${date_end}.log.json`)
    // отправка новых новостей в RabitMQ
    //await this.broker.publish(this.queueName, data, { persistent: true });
  }
  
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async start() {
    //await this.broker.connect();
    //await this.broker.createQueue(this.queueName, { durable: true });
    
    // автоматический опрос твиттера для получение новостей каждые 5 мин
    while (true) {
      await fileManager.SaveTimeStart()
      let dateObj = await fileManager.ReadConfig()
      // Сохранить все посты с последнего запуска до сегодняшнего дня
      await this.savePosts(dateObj.time_end, dateObj.time_start)
      await fileManager.SaveTimeStop()
      await this.sleep(10000)
    } 

    // Проверка, что из брокера можно забрать данные 
    // await this.broker.consume(this.queueName, async (payload) => {
    //   fileManager.Write(payload, "broker-data.log.json")
    // }, { noAck: false });
  }

  async stop() {
    // остановка автоматического сбора
    await fileManager.SaveTimeStop()
    await this.broker.disconnect()
  }

  standardization(hist, user){
    hist.data = leadToTheSchemeTwitterPost(hist, user)
    return replaceKeyInObjectArray(hist.data, this._replaceMap)
  }

}

module.exports = new BotClient();