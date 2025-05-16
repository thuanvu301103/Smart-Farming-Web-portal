import {
    Controller, Get, Post, Patch, Delete, Body,
    Param, Query, Req,
    ForbiddenException, BadRequestException,
} from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { ModelsService } from './models.service';
import { JwtAuthGuard } from "./../auth/jwt-auth.guard";
// DTO
import { BaseSearchModelQueryDto } from '../../dto/models.dto';

@Controller('model-versions')
export class ModelVersionController{
    constructor(private readonly modelsService: ModelsService) { }

    /*----- Registered Model Version -----*/

    @Post('create')
    async createModelVersion(
        @Body() data: {
            name: string,
            source: string,
            tags: {key: string, value: string}[],
            description: string
        }
    ) {
        return await this.modelsService.createVersion(data.name, data.source, data.tags, data.description);
    }

    @Get('get')
    async getModelVersion(
        @Query('name') name: string,
        @Query('version') version: string
    ) {
        return await this.modelsService.getVersion(name, version);
    }

    @Patch('update')
    async updateVersion(
        @Body() data: {
            name: string,
            version: string,
            description: string
        }
    ) {
        return await this.modelsService.updateVersion(data.name, data.version, data.description);
    }

    @Delete('delete')
    async deleteModel(
        @Body() data: {
            name: string,
            version: string
        }
    ) {
        return await this.modelsService.deleteVersion(data.name, data.version);
    }

    @Post('get-latest-versions')
    async getLastestVersion(
        @Body() data: {
            name: string,
            stages: string[]
        }
    ) {
        return await this.modelsService.getLastestVersion(data.name, data.stages);
    }
    
    @Get('search')
    async searchModel(
        @Query('filter') filter: string,
        @Query('max_results') max_results: number = 100,
        @Query('order_by') order_by: string[] = ['name ASC'],
        @Query('page_token') page_token?: string
    ) {
        //const filterDecoded = decodeURIComponent(filter);
        //console.log("Search: ", filter, max_results, order_by, page_token);
        return await this.modelsService.searchModel(filter, max_results, order_by, page_token);
    }

    @Post('set-tag')
    async setModelTag(
        @Body() data: {
            name: string,
            key: string, 
            value: string
        }
    ) {
        return await this.modelsService.setModelTag(data.name, data.key, data.value);
    }

    @Delete('delete-tag')
    async deleteModelTag(
        @Body() data: {
            name: string,
            key: string
        }
    ) {
        return await this.modelsService.deleteModelTag(data.name, data.key);
    }
}
