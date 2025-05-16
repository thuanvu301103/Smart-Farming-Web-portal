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
        console.log("Creating new Model: ", data.name, '-', data.description);
        return await this.modelsService.createModel(data.name, data.tags, data.description);
    }
}
