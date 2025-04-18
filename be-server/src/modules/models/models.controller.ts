import {
    Controller, Get, Post, Patch, Delete, Body,
    Param, Query, Req,
    UseGuards,
    ForbiddenException, BadRequestException,
} from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { ModelsService } from './models.service';
import { JwtAuthGuard } from "./../auth/jwt-auth.guard";
// DTO
import { BaseSearchModelQueryDto } from '../../dto/models.dto';

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
        @Param('userId') userId: string,
        @Query() query: BaseSearchModelQueryDto
    ) {
        return await this.modelsService.getAllRegisteredModels(userId, query);
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

    @Post('set-schedule')
    @UseGuards(JwtAuthGuard)
    async setModelSchedule(
        @Param('userId') userId: string,
        @Body() data: {
            model_id: string,
            cron_string: string
        },
        @Req() req
    ) {
        const currentUserId = req.user.userId;
        if (currentUserId !== userId) {
            throw new ForbiddenException('You can only set schedule your own models.');
        }
        if (!Types.ObjectId.isValid(data.model_id)) {
            throw new BadRequestException('Invalid model_id');
        }
        //console.log("Outside 1: ", await this.isValidCron(data.cron_string));
        //console.log("Outdise 2:", !(await this.isValidCron(data.cron_string)));
        if (!(await this.isValidCron(data.cron_string))) {
            //console.log("Throw Invalid CRON");
            throw new BadRequestException('Invalid cron_string');
        }
        return this.modelsService.setModelSchedule(data.model_id, data.cron_string)
    }

    @Get('get-schedule')
    @UseGuards(JwtAuthGuard)
    async getModelSchedule(
        @Param('userId') userId: string,
        @Query('model_id') modelId: string,
        @Req() req
    ) {
        const currentUserId = req.user.userId;
        if (currentUserId !== userId) {
            throw new ForbiddenException('You can only get schedule your own models.');
        }
        if (!Types.ObjectId.isValid(modelId)) {
            throw new BadRequestException('Invalid model_id');
        }
        return this.modelsService.getModelSchedule(modelId);
    }

    @Get('get-schedule-plan')
    @UseGuards(JwtAuthGuard)
    async getModelSchedulePlan(
        @Param('userId') userId: string,
        @Query('modelId') modelId: string,
        @Query('end_date') endDate: string,
        @Req() req
    ) {
        const currentUserId = req.user.userId;
        if (currentUserId !== userId) {
            throw new ForbiddenException('You can only get schedule your own models.');
        }
        if (modelId && !Types.ObjectId.isValid(modelId)) {
            throw new BadRequestException('Invalid modelId');
        }
        if (!await this.isValidDate(endDate)) {
        //if (!(await this.isValidDate(startDate)) || !(await this.isValidDate(endDate))) {
            throw new BadRequestException('Invalid end_date format');
        }
        const currTime = new Date();
        //currTime.setHours(0, 0, 0, 0);
        const endTime = new Date(endDate);
        endTime.setHours(23, 59, 59, 999);
        if (currTime > endTime) {
            throw new BadRequestException('Invalid end_date. end_date must be after or equal to current date time.');
        }
        
        return this.modelsService.getModelSchedulePlan(userId, modelId, currTime, endTime);
    }

    @Patch('set-enable-schedule')
    @UseGuards(JwtAuthGuard)
    async setModelEnableSchedule(
        @Param('userId') userId: string,
        @Query('model_id') model_id: string,
        @Body() data: {enableSchedule: boolean},
        @Req() req
    ) {
        const currentUserId = req.user.userId;
        if (currentUserId !== userId) {
            throw new ForbiddenException('You can only get schedule your own models.');
        }
        if (!Types.ObjectId.isValid(model_id)) {
            throw new BadRequestException('Invalid model_id');
        }
        return this.modelsService.setModelEnableSchedule(userId, model_id, data.enableSchedule);
    }

    /* ----- Registered Model Version ----- */
    @Get('versions/get-all')
    @UseGuards(JwtAuthGuard)
    async getAllModelVersion(
        @Param('userId') userId: string,
        @Query('name') name: string,
        @Query('page_token') page_token: string,
    ) {
        return this.modelsService.getAllModelVersions(userId, name, page_token ? page_token : "0");
    }

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

    /* ----- Helper functions -----*/
    async isValidCron(cronString) {
        const cronRegex = /^(\*|([0-9]{1,2})(-[0-9]{1,2})?(\/[0-9]{1,2})?,?)+\s(\*|([0-9]{1,2})(-[0-9]{1,2})?(\/[0-9]{1,2})?,?)+\s(\*|([0-9]{1,2})(-[0-9]{1,2})?(\/[0-9]{1,2})?,?)+\s(\*|([0-9]{1,2})(-[0-9]{1,2})?(\/[0-9]{1,2})?,?)+\s(\*|([0-9]{1,2})(-[0-9]{1,2})?(\/[0-9]{1,2})?,?)+$/;
        //console.log("Inside: ", cronRegex.test(cronString))
        return cronRegex.test(cronString);
    }

    async isValidDate(dateString) {
        // Format yyyy-mm-dd
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        if (!regex.test(dateString)) {
            return false;
        }
        const [year, month, day] = dateString.split('-').map(Number);
        //console.log(year, month, day)
        const date = new Date(year, month - 1, day);
        return (
            date.getFullYear() === year &&
            date.getMonth() === month - 1 &&
            date.getDate() === day
        );
    }
}
