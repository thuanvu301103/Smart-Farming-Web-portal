import { Controller, Get, Post, Body, UseGuards, Param, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '../../schemas/users.schema';
import { JwtAuthGuard } from "./../auth/jwt-auth.guard";

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

    @Get('users/search')
    async searchUser(@Query('username') partUsername: string) {
        if (!partUsername) {
            return { error: 'Username query parameter is required' };
        }
        return await this.usersService.searchUser(partUsername);
    }

    @Get(':userId/profile')
    @UseGuards(JwtAuthGuard)
    async findUserInfo(@Param('userId') userId: string): Promise<{
        username: string;
        links: {
            type: string;
            link: string
        }[];
        profile_image: string
    }> {
        return this.usersService.getInfoUser(userId);
    }
}