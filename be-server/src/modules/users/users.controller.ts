import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '../../schemas/users.schema';

@Controller(':userId')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get('profile')
    async findAllUsers(@Param('userId') userId: string): Promise<{
        username: string;
        links: {
            type: string;
            link: string
        }[]
    }> {
        return this.usersService.getInfoUser(userId);
    }
}
