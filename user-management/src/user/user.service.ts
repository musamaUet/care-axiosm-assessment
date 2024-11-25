import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { User } from './user.entity';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class UserService {
  constructor(
    @Inject('MESSAGE_QUEUE') private client: ClientProxy,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async createUser(data: Partial<User>): Promise<User> {
    const user = this.userRepository.create(data);
    return await this.userRepository.save(user);
  }

  async getAllUsers(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async getPaginatedUsersOver18(page: number, limit: number): Promise<User[]> {
    return this.userRepository.find({
      where: { age: MoreThan(18) },
      order: { name: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }
}
