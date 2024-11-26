import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class MessageQueueService implements OnModuleInit, OnModuleDestroy {
  private connection: amqp.Connection;
  private channel: amqp.Channel;
  private readonly rabbitmqUrl: string;
  private readonly queueName: string;

  constructor() {
    this.rabbitmqUrl = process.env.RABBITMQ_URL || 'amqp://localhost';
    this.queueName = process.env.RABBITMQ_QUEUE || 'welcomeQueue';
  }

  async onModuleInit() {
    await this.connect();
  }

  async onModuleDestroy() {
    await this.disconnect();
  }

  private async connect() {
    try {
      console.log('Connecting to RabbitMQ...');
      this.connection = await amqp.connect(this.rabbitmqUrl);
      this.channel = await this.connection.createChannel();
      await this.channel.assertQueue(this.queueName, { durable: true });
      console.log(`RabbitMQ connected. Queue '${this.queueName}' is ready.`);
    } catch (error) {
      console.error('Failed to connect to RabbitMQ:', error);
      throw new Error('Failed to initialize RabbitMQ connection.');
    }
  }

  private async disconnect() {
    try {
      if (this.channel) {
        await this.channel.close();
        console.log('RabbitMQ channel closed.');
      }
      if (this.connection) {
        await this.connection.close();
        console.log('RabbitMQ connection closed.');
      }
    } catch (error) {
      console.error('Error while disconnecting from RabbitMQ:', error);
    }
  }

  async sendMessage(message: string) {
    if (!this.channel) {
      throw new Error('RabbitMQ channel is not initialized.');
    }
    try {
      this.channel.sendToQueue(this.queueName, Buffer.from(message), {
        persistent: true,
      });
      console.log(`Message sent to queue '${this.queueName}': ${message}`);
    } catch (error) {
      console.error('Error sending message to RabbitMQ:', error);
      throw error;
    }
  }

  async consumeMessages() {
    if (!this.channel) {
      throw new Error('RabbitMQ channel is not initialized.');
    }
    try {
      this.channel.consume(this.queueName, (msg) => {
        if (msg) {
          console.log('Received message:', msg.content.toString());
          this.channel.ack(msg);
        }
      });
    } catch (error) {
      console.error('Error consuming messages from RabbitMQ:', error);
      throw error;
    }
  }
}
