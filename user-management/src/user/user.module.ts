import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageQueueService } from 'src/message-queue.service';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    CacheModule.register({
      store: 'redis',
      host: 'localhost',
      port: 6379,
    }),
  ],
  providers: [UserService, MessageQueueService],
  controllers: [UserController],
})
export class UserModule {}
