import { Controller, Get, Post, Put, Body, UseGuards, Param, Query, Req, ForbiddenException  } from '@nestjs/common';
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
    @UseGuards(JwtAuthGuard)
    async searchUser(@Query('username') partUsername: string, @Req() req) {
        if (!partUsername) {
            return { error: 'Username query parameter is required' };
        }

        const currentUserId = req.user.userId;
        return await this.usersService.searchUser(partUsername, currentUserId);
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

    @Put(':userId')
    @UseGuards(JwtAuthGuard)
    async updateUser(@Param('userId') userId: string, @Body() updatedData: any, @Req() req) {

        const currentUserId = req.user.userId;
        if (currentUserId !== userId) {
            throw new ForbiddenException("You cannot edit other user's information");
        }

        return await this.usersService.updateUserInfo(userId, updatedData);
    }

    @Put(':userId/favorite')
    @UseGuards(JwtAuthGuard)
    async favoriteScript(
        @Param('userId') userId: string,
        @Body() { scriptId, action }: { scriptId: string; action: 'add' | 'remove' },
        @Req() req
    ) {
        const currentUserId = req.user.userId; // Get the current user from JWT

        // Ensure users can only modify their own favorites
        if (currentUserId !== userId) {
            throw new ForbiddenException('You can only update your own favorites.');
        }

        return await this.usersService.favoriteScript(userId, scriptId, action);
    }
}