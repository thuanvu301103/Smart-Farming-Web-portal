import { Controller, Get, Post, Put, Delete, Body, Param, Query, Req, UseGuards, ForbiddenException } from '@nestjs/common';
import { ScriptsService } from './scripts.service';
import { Script } from '../../schemas/scripts.schema';
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
        //console.log(req.user.userId);
        return this.scriptsService.findAllScripts(userId, req.user.userId);
    }

    @Get("/top")
    @UseGuards(JwtAuthGuard)
    async getTopPublicScriptsByUser(@Param("userId") userId: string) {
        return await this.scriptsService.getTopPublicScripts(userId);
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
    async getScript(@Param('scriptId') scriptId: string):
        Promise<Script> {
        return this.scriptsService.getScript(scriptId);
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
    async updateScript(@Param('scriptId') scriptId: string, @Body() updatedData: any) {
        return await this.scriptsService.updateScriptInfo(scriptId, updatedData);
    }

    @Delete(':scriptId')
    async deleteScript(@Param('scriptId') scriptId: string) {
        return await this.scriptsService.deleteScript(scriptId);
    }
}
