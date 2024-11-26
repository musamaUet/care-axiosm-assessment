import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { MessageQueueService } from 'src/message-queue.service';
import { Cache } from '@nestjs/cache-manager';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @Inject('CACHE_MANAGER') private cacheManager: Cache,
    private readonly messageQueueService: MessageQueueService,
  ) {}

  async createUser(data: Partial<User>): Promise<User> {
    const newUser = await this.userRepository.save(data);
    await this.messageQueueService.sendMessage(`Welcome, ${newUser.name}`);
    return newUser;
  }

  async getAllUsers(page: number, limit: number): Promise<User[]> {
    const cacheKey = `users:page:${page}:limit:${limit}`;
    const cachedUsers = await this.cacheManager.get<User[]>(cacheKey);
    if (cachedUsers) return cachedUsers;

    const users = await this.userRepository.find({
      skip: (page - 1) * limit,
      take: limit,
    });

    // @ts-ignore
    await this.cacheManager.set(cacheKey, users, { ttl: 300 }); // Cache for 5 minutes
    return users;
  }
}
