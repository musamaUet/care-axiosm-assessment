import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { CreateUserDto } from './dto/CreateUser.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() userData: CreateUserDto): Promise<User> {
    return this.userService.createUser(userData);
  }

  @Get()
  async getAllUsers(): Promise<User[]> {
    return this.userService.getAllUsers();
  }

  @Get('/paginated-over-18')
  async getPaginatedUsersOver18(
    @Query('page') page: string,
    @Query('limit') limit: string,
  ): Promise<User[]> {
    const pageNumber = parseInt(page, 10) || 1; // Default to page 1 if not provided
    const limitNumber = parseInt(limit, 10) || 10; // Default to 10 items per page
    return this.userService.getPaginatedUsersOver18(pageNumber, limitNumber);
  }
}
