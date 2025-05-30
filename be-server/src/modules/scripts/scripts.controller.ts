import {
    Controller, Get, Post, Put, Patch, Delete, Body, Param, Query, Req, UseGuards,
    ForbiddenException, BadRequestException, 
} from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { ScriptsService } from './scripts.service';
import { JwtAuthGuard } from "./../auth/jwt-auth.guard";
// DTO
import { ScriptQueryDto, CreateScriptBodyDto } from '../../dto/scripts.dto';

@Controller(':userId/scripts')
export class ScriptsController {
    constructor(
        private readonly scriptsService: ScriptsService
    ) { }


    @Get()
    @UseGuards(JwtAuthGuard)
    async findAllScripts(
        @Param("userId") userId: string,
        @Req() req,
        @Query() query: ScriptQueryDto,
    ) {
        console.log(userId, req.user.userId);
        if (!Types.ObjectId.isValid(userId)) {
            throw new BadRequestException('Invalid userId');
        }
        return this.scriptsService.findAllScripts(userId, req.user.userId, query);
    }

    @Get("/top")
    @UseGuards(JwtAuthGuard)
    async getTopPublicScriptsByUser(
        @Param("userId") userId: string,
        @Query("filterBy") filterBy: string,
        @Req() req) {
        if (!Types.ObjectId.isValid(userId)) {
            throw new BadRequestException('Invalid userId');
        }
        const filterOption = ["favorite", "rating"];
        if (!filterOption.includes(filterBy)) throw new BadRequestException("Invalid Filter Option");
        const currentUserId = req.user.userId;
        return await this.scriptsService.getTopPublicScripts(userId, currentUserId, filterBy);
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
        @Body() data: CreateScriptBodyDto,
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
            userId, data
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

    /* ========== Rating ========== */
    @Get(':scriptId/total-rate')
    @UseGuards(JwtAuthGuard)
    async getScriptRate(
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
        return this.scriptsService.getScriptRate(scriptId);
    }

    @Get(':scriptId/rate')
    @UseGuards(JwtAuthGuard)
    async getRate(
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
        //if (currentUserId != userId) throw new ForbiddenException('You can only access your own property!');
        return this.scriptsService.getRate(currentUserId, scriptId);
    }

    @Post(':scriptId/rate')
    @UseGuards(JwtAuthGuard)
    async createRate(
        @Param('userId') userId: string,
        @Param('scriptId') scriptId: string,
        @Body() data: {rate: number},
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
        //if (currentUserId != userId) throw new ForbiddenException('You can only access your own property!');
        return this.scriptsService.createRate(currentUserId, scriptId, data.rate);
    }

    @Patch(':scriptId/rate')
    @UseGuards(JwtAuthGuard)
    async updateRate(
        @Param('userId') userId: string,
        @Param('scriptId') scriptId: string,
        @Body() data: { rate: number },
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
        //if (currentUserId != userId) throw new ForbiddenException('You can only access your own property!');
        return this.scriptsService.updateRate(currentUserId, scriptId, data.rate);
    }

    @Delete(':scriptId/rate')
    @UseGuards(JwtAuthGuard)
    async deleteRate(
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
        //if (currentUserId != userId) throw new ForbiddenException('You can only access your own property!');
        return this.scriptsService.deleteRate(currentUserId, scriptId);
    }

}
