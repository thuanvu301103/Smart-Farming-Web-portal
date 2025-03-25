import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ModelsService } from './models.service';
import { JwtAuthGuard } from "./../auth/jwt-auth.guard";

@Controller(':userId/models')
export class ModelsController {
    constructor(private readonly modelsService: ModelsService) { }

    @Post('create')
    @UseGuards(JwtAuthGuard)
    async createRegisteredModel(
        @Param('userId') userId: string,
        @Body() data: {
            name: string,
            tags: {key: string, value: string}[],
            description: string
        }
    ) {
        return await this.modelsService.createRegisteredModel(userId, data.name, data.tags, data.description);
    }

    @Get('get-all')
    @UseGuards(JwtAuthGuard)
    async getAllRegisteredModels(
        @Param('userId') userId: string
    ) {
        return await this.modelsService.getAllRegisteredModels(userId);
    }

    @Get('get')
    @UseGuards(JwtAuthGuard)
    async getRegisteredModel(
        @Param('userId') userId: string,
        @Query('name') name: string
    ) {
        return await this.modelsService.getRegisteredModel(userId, name);
    }

    @Post('rename')
    @UseGuards(JwtAuthGuard)
    async renameRegisteredModel(
        @Param('userId') userId: string,
        @Body() data: { name: string, new_name: string}
    ) {
        return await this.modelsService.renameRegisteredModel(userId, data.name, data.new_name);
    }

    @Patch('update')
    @UseGuards(JwtAuthGuard)
    async updateRegisteredModel(
        @Param('userId') userId: string,
        @Body() data: { name: string, description: string }
    ) {
        return await this.modelsService.updateRegisteredModel(userId, data.name, data.description);
    }

    @Delete('delete')
    @UseGuards(JwtAuthGuard)
    async deleteRegisteredModel(
        @Param('userId') userId: string,
        @Body() data: { name: string }
    ) {
        return await this.modelsService.deleteRegisteredModel(userId, data.name);
    }
}
