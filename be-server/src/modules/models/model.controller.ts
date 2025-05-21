import {
    Controller, Get, Post, Patch, Delete, Body,
    Param, Query, Req,
    ForbiddenException, BadRequestException,
} from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { ModelsService } from './models.service';
import { JwtAuthGuard } from "./../auth/jwt-auth.guard";
import axios from 'axios';
// DTO
import { BaseSearchModelQueryDto } from '../../dto/models.dto';

@Controller('models')
export class ModelController {
    constructor(private readonly modelsService: ModelsService) { }
    private python_server: string = 'http://10.1.8.52:7000';

    @Post('create')
    async createModel(
        @Body() data: {
            name: string,
            tags: { key: string, value: string }[],
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
    ) {
        try {
            // Gọi service xử lý subscribe
            const result = await this.modelsService.subscribeModel(
                data.user_id,
                data.model_name,
                data.location
            );

            // Gọi Python server để tự động add job
            const addJobResp = await axios.post(`${this.python_server}/models/add-job`, null, {
                params: {
                    model_name: data.model_name
                }
            });

            console.log("✅ Job added:", addJobResp.data);

            return result;

        } catch (error) {
            console.error("❌ Error in subscribeModel:", error?.response?.data || error.message);
            throw error;
        }
    }

    @Get('get-all-subscribed')
    async getSubcribedModel(
        @Query('user_id') userId: string
    ) {
        return await this.modelsService.getSubscribedModel(userId);
    }

    @Delete('un-subscribe')
    async unSubcribeModel(
        @Body() data: {
            user_id: string,
            model_name: string
        }
    ) {
        try {
            const result = await this.modelsService.unSubscribeModel(
                data.user_id,
                data.model_name
            );

            // Gọi Python server để xóa job khỏi scheduler
            const removeJobResp = await axios.delete(`${this.python_server}/remove-job/${data.model_name}`);

            console.log("🗑️ Job removed:", removeJobResp.data);

            return result;

        } catch (error) {
            console.error("❌ Error in unSubcribeModel:", error?.response?.data || error.message);
            throw error;
        }
    }

    @Get('get-schedule-plan')
    async getModelSchedulePlan(
        @Query('userId') userId: string,
        @Query('end_date') endDate: string,
        @Req() req
    ) {
        const currTime = new Date();
        //currTime.setHours(0, 0, 0, 0);
        const endTime = new Date(endDate);
        endTime.setHours(23, 59, 59, 999);
        if (currTime > endTime) {
            throw new BadRequestException('Invalid end_date. end_date must be after or equal to current date time.');
        }

        return this.modelsService.getSchedulePlan(userId, currTime, endTime);
    }
}
