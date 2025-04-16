import {
    Controller, Get, Post, Put, Body, UseGuards, Param, Query, Req,
    ForbiddenException, BadRequestException,
} from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { UsersService } from './users.service';
import { JwtAuthGuard } from "./../auth/jwt-auth.guard";
// DTO
import { SearchUserByIdQueryDto, SearchUserByNameQueryDto } from '../../dto/users.dto';
import { BaseSearchScriptQueryDto } from '../../dto/scripts.dto';

@Controller()
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get('users')
    async findAllUsers(@Query() query: SearchUserByIdQueryDto) {
        return this.usersService.getAllUsers(query);
    }

    @Get('users/search')
    @UseGuards(JwtAuthGuard)
    async searchUser(@Query() query: SearchUserByNameQueryDto, @Req() req) {
        const currentUserId = req.user.userId;
        return await this.usersService.searchUser(query, currentUserId);
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

    @Get(':userId/favorite-script')
    @UseGuards(JwtAuthGuard)
    async getFavoriteScript(
        @Param('userId') userId: string,
        @Query() query: BaseSearchScriptQueryDto
    ) {
        return this.usersService.getFavoriteScript(userId, query);
    }

    @Get(':userId/shared-script')
    @UseGuards(JwtAuthGuard)
    async getSharedScripts(
        @Param('userId') userId: string,
        @Query() query: BaseSearchScriptQueryDto,
        @Req() req
    ) {
        if (!Types.ObjectId.isValid(userId)) {
            throw new BadRequestException('Invalid userId');
        }
        const currentUserId = req.user.userId;
        if (currentUserId !== userId) {
            throw new ForbiddenException('You can only access your own shared scripts');
        }
        return this.usersService.getSharedScripts(userId, query);
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