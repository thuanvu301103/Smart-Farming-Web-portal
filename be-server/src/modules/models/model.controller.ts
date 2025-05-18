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

@Controller('models')
export class ModelController{
    constructor(private readonly modelsService: ModelsService) { }

    @Post('create')
    async createModel(
        @Body() data: {
            name: string,
            tags: {key: string, value: string}[],
            description: string
        }
    ) {
        //console.log("Creating new Model: ", data.name, '-', data.description);
        return await this.modelsService.createModel(data.name, data.tags, data.description);
    }

    @Get('get')
    async getModel(
        @Query('name') name: string
    ) {
        return await this.modelsService.getModel(name);
    }

    @Post('rename')
    async renameModel(
        @Body() data: {
            name: string,
            new_name: string
        }
    ) {
        return await this.modelsService.renameModel(data.name, data.new_name);
    }

    @Patch('update')
    async updateModel(
        @Body() data: {
            name: string,
            description: string
        }
    ) {
        return await this.modelsService.updateModel(data.name, data.description);
    }

    @Delete('delete')
    async deleteModel(
        @Body() data: {
            name: string
        }
    ) {
        return await this.modelsService.deleteModel(data.name);
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

    @Post('subscribe')
    async subcribeModel(
        @Body() data: {
            user_id: string,
            model_name: string,
            location: string
        }
    ){
        return await this.modelsService.subscribeModel(data.user_id, data.model_name, data.location);
    }

    @Get('get-all-subscribed')
    async getSubcribedModel(
        @Query('user_id') userId: string
    ){
        return await this.modelsService.getSubscribedModel(userId);
    }

    @Delete('un-subscribe')
    async unSubcribeModel(
        @Body() data: {
            user_id: string,
            model_name: string
        }
    ){
        return await this.modelsService.unSubscribeModel(data.user_id, data.model_name);
    }
}
