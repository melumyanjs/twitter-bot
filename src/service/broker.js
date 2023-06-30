const amqp = require('amqplib')

class Broker {
    constructor(uri) {
        this.uri = uri;
        this.connection = null;
        this.channel = null;
      }
    
      async connect() {
        this.connection = await amqp.connect(this.uri);
        this.channel = await this.connection.createChannel();
      }
    
      async createQueue(queueName, options) {
        await this.channel.assertQueue(queueName, options);
      }
    
      async publish(queueName, message, options) {
        await this.channel.assertQueue(queueName, { durable: true });
        await this.channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), options);
      }
    
      async consume(queueName, handler, options) {
        await this.channel.assertQueue(queueName, { durable: true });
        await this.channel.consume(queueName, async (message) => {
          const payload = JSON.parse(message.content.toString());
          await handler(payload);
          this.channel.ack(message);
        }, options);
      }
    
      async disconnect() {
        await this.channel.close();
        await this.connection.close();
      }
}

module.exports = Broker