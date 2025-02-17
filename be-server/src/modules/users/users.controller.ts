import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '../../schemas/users.schema';

@Controller()
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get('users')
    async findAllUsers(@Query('ids') ids: string | string[]): Promise<{
        _id: string;
        username: string
    }[]
        > {
        const userIds = Array.isArray(ids) ? ids : ids.split(',');
        return this.usersService.getAllUsers(userIds);
    }

    @Get(':userId/profile')
    async findUserInfo(@Param('userId') userId: string): Promise<{
        username: string;
        links: {
            type: string;
            link: string
        }[]
    }> {
        return this.usersService.getInfoUser(userId);
    }
}