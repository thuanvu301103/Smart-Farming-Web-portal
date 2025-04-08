import {
    Controller, Get, Post, Put, Delete, Body, Param, Query, Req, UseGuards,
    ForbiddenException, BadRequestException, 
} from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { ScriptsService } from './scripts.service';
import { JwtAuthGuard } from "./../auth/jwt-auth.guard";

@Controller(':userId/scripts')
export class ScriptsController {
    constructor(
        private readonly scriptsService: ScriptsService
    ) { }

    @Get()
    @UseGuards(JwtAuthGuard)
    async findAllScripts(@Param('userId') userId: string, @Req() req):
        Promise<{
            name: string;
            description: string;
            privacy: string;
            favorite: number;
            location: string[];
            plant_type: string[];
            isFavorite: boolean
        }[]>
    {
        if (!Types.ObjectId.isValid(userId)) {
            throw new BadRequestException('Invalid userId');
        }
        return this.scriptsService.findAllScripts(userId, req.user.userId);
    }

    @Get("/top")
    @UseGuards(JwtAuthGuard)
    async getTopPublicScriptsByUser(@Param("userId") userId: string, @Req() req) {
        if (!Types.ObjectId.isValid(userId)) {
            throw new BadRequestException('Invalid userId');
        }
        const currentUserId = req.user.userId;
        return await this.scriptsService.getTopPublicScripts(userId, currentUserId);
    }

    @Get('search')
    async searchScripts(
        @Query('loc') locations: string | string[]
    ):
        Promise<{
            name: string;
            description: string;
            privacy: string
        }[]> {
        const locationsArray = Array.isArray(locations) ? locations : locations.split(',');
        return this.scriptsService.findScriptsByLocations(locationsArray);
    }

    @Get(':scriptId')
    @UseGuards(JwtAuthGuard)
    async getScript(
        @Param('userId') userId: string,
        @Param('scriptId') scriptId: string,
        @Req() req
    ):
        Promise<any> {
        if (!Types.ObjectId.isValid(userId)) {
            throw new BadRequestException('Invalid userId');
        }
        if (!Types.ObjectId.isValid(scriptId)) {
            throw new BadRequestException('Invalid scriptId');
        }
        const currentUserId = req.user.userId;
        return this.scriptsService.getScript(currentUserId, userId, scriptId);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    async createScript(
        @Body() data: { name: string; description: string; privacy: string, share_id: string[] },
        @Param('userId') userId: string,
        @Req() req
    ):
        Promise<{ _id: string }> {
        const currentUserId = req.user.userId; // Get the current user from JWT
        // Ensure users can only modify their own favorites
        if (currentUserId !== userId) {
            throw new ForbiddenException('You can only update your own favorites.');
        }

        const newScriptId = await this.scriptsService.createScript(
            userId, data.name, data.description, data.privacy, data.share_id
        );
        return { _id: newScriptId};
    }

    @Put(':scriptId')
    @UseGuards(JwtAuthGuard)
    async updateScript(
        @Param('userId') userId: string,
        @Param('scriptId') scriptId: string,
        @Body() updatedData: any,
        @Req() req
    ) {
        if (!Types.ObjectId.isValid(userId)) {
            throw new BadRequestException('Invalid userId');
        }
        if (!Types.ObjectId.isValid(scriptId)) {
            throw new BadRequestException('Invalid scriptId');
        }
        const currentUserId = req.user.userId;
        return await this.scriptsService.updateScriptInfo(currentUserId, userId, scriptId, updatedData);
    }

    @Delete(':scriptId')
    @UseGuards(JwtAuthGuard)
    async deleteScript(
        @Param("userId") userId: string,
        @Param('scriptId') scriptId: string,
        @Req() req
    ) {
        const currentUserId = req.user.userId; // Get the current user from JWT
        // Ensure users can only modify their own favorites
        if (currentUserId !== userId) {
            throw new ForbiddenException('You can only delete your own script.');
        }
        return await this.scriptsService.deleteScript(scriptId);
    }
}
