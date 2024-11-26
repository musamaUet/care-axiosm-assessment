import { Injectable } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class MessageQueueService {
  private connection;
  private channel;

  async connect() {
    this.connection = await amqp.connect('amqp://localhost');
    this.channel = await this.connection.createChannel();
    await this.channel.assertQueue('welcomeQueue');
  }

  async sendMessage(message: string) {
    await this.channel.sendToQueue('welcomeQueue', Buffer.from(message));
  }

  async consumeMessages() {
    this.channel.consume('welcomeQueue', (msg) => {
      if (msg) {
        console.log('Received:', msg.content.toString());
        this.channel.ack(msg);
      }
    });
  }
}
