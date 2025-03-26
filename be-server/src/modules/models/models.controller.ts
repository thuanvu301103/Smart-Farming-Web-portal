import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ModelsService } from './models.service';
import { JwtAuthGuard } from "./../auth/jwt-auth.guard";

@Controller(':userId/models')
export class ModelsController {
    constructor(private readonly modelsService: ModelsService) { }

    /* ----- Registered Model ----- */
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

    @Post('get-latest-version')
    @UseGuards(JwtAuthGuard)
    async getLatestModelVersions(
        @Param('userId') userId: string,
        @Body() data: {
            name: string,
            stages: string[]
        }
    ) {
        return this.modelsService.getLatestModelVersions(userId, data.name, data.stages);
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

    @Post('set-tag')
    @UseGuards(JwtAuthGuard)
    async setRegisteredModelTag(
        @Param('userId') userId: string,
        @Body() data: {
            name: string,
            key: string,
            value: string
        }
    ) {
        return this.modelsService.setRegisteredModelTag(userId, data.name, data.key, data.value);
    }

    @Delete('delete-tag')
    @UseGuards(JwtAuthGuard)
    async deleteRegisteredModelTag(
        @Param('userId') userId: string,
        @Body() data: {
            name: string,
            key: string
        }
    ) {
        return this.modelsService.deleteRegisteredModelTag(userId, data.name, data.key);
    }

    /* ----- Registered Model Version ----- */
    @Post('versions/create')
    @UseGuards(JwtAuthGuard)
    async createModelVersion(
        @Param('userId') userId: string,
        @Body() data: {
            name: string,
            source: string,
            run_id: string,
            tags: string[],
            run_link: string,
            description: string
        }
    ) {
        //console.log("Calling create model version");
        return this.modelsService.createModelVersion(userId, data.name, data.source, data.run_id, data.tags, data.run_link, data.description);
    }

    @Get('versions/get')
    @UseGuards(JwtAuthGuard)
    async getModelVersion(
        @Param('userId') userId: string,
        @Query('name') name: string,
        @Query('version') version: string,
    ) {
        //console.log("Calling create model version");
        return this.modelsService.getModelVersion(userId, name, version);
    }

    @Patch('versions/update')
    @UseGuards(JwtAuthGuard)
    async updateModelVersion(
        @Param('userId') userId: string,
        @Body() data: {
            name: string,
            version: string,
            description: string
        }
    ) {
        return this.modelsService.updateModelVersion(userId, data.name, data.version, data.description);
    }

    @Delete('versions/delete')
    @UseGuards(JwtAuthGuard)
    async deleteModelVersion(
        @Param('userId') userId: string,
        @Body() data: {
            name: string,
            version: string
        }
    ) {
        return this.modelsService.deleteModelVersion(userId, data.name, data.version);
    }

    @Post('versions/set-tag')
    @UseGuards(JwtAuthGuard)
    async setModelVersionTag(
        @Param('userId') userId: string,
        @Body() data: {
            name: string,
            version: string,
            key: string,
            value: string
        }
    ) {
        return this.modelsService.setModelVersionTag(userId, data.name, data.version, data.key, data.value);
    }

    @Delete('versions/delete-tag')
    @UseGuards(JwtAuthGuard)
    async deleteModelVersionTag(
        @Param('userId') userId: string,
        @Body() data: {
            name: string,
            version: string,
            key: string
        }
    ) {
        return this.modelsService.deleteModelVersionTag(userId, data.name, data.version, data.key);
    }
}
