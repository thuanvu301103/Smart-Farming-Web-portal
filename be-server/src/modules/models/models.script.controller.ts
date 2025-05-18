import {
    Controller,
    Get, Post, Patch, Delete,
    Body, Param, Query, Req,
    UseGuards, UseInterceptors,
    UploadedFiles
} from '@nestjs/common';
import { ModelScriptsService } from './models.script.service';
import { JwtAuthGuard } from "./../auth/jwt-auth.guard";
import { FilesInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
// DTO
import { BaseSearchModelScriptQueryDto } from '../../dto/model.scripts.dto';

const storage = multer.diskStorage({
    destination: path.join(__dirname, "./../uploads"), // Temporary folder
    filename: (req, file, cb) => {
        const extension = path.extname(file.originalname);
        const newFilename = `${path.basename(file.originalname, extension)}${extension}`;
        cb(null, newFilename);
    }
});

@Controller(':userId/models/scripts')
export class ModelScriptsController {
    constructor(private readonly modelScriptService: ModelScriptsService) { }

    @Post('generate')
    @UseGuards(JwtAuthGuard)
    async generateModelScript(
        @Body('model_name') model_name: string,
        @Body('model_version') model_version: string,
        @Body('location') location: string,
        @Body('avg_temp') temp: number,
        @Body('avg_humid') humid: number,
        @Body('avg_rainfall') rainfall: number,
        @Param("userId") userId: string,
    ) {
        try {
            return await this.modelScriptService.genScript(userId, model_name, model_version, location, temp, humid, rainfall);
        } catch (error) {
            throw error;
        }
    }

    @Post('upload')
    @UseInterceptors(FilesInterceptor('file', 50, { storage }))
    async uploadModelScript(
        @UploadedFiles() file: Express.Multer.File,
        @Body('model_name') model_name: string,
        @Body('model_version') model_version: string,
        @Body('location') location: string,
        @Body('avg_temp') temp: string,
        @Body('avg_humid') humid: string,
        @Body('avg_rainfall') rainfall: string,
        @Param("userId") userId: string,
    ) {
        try {
            await this.modelScriptService.uploadModelScript(file, userId, model_name, model_version, location, temp, humid, rainfall);
        } catch (error) {
            throw error;
        }
        return { message: 'Files uploaded successfully to Server' };
    }

    @Get('get-all')
    @UseGuards(JwtAuthGuard)
    async getAllModelScripts(
        @Query() query: BaseSearchModelScriptQueryDto,
        @Param("userId") userId: string,
    ) {
        return await this.modelScriptService.getAllModelScripts(userId, query);
    }

    @Get('get')
    @UseGuards(JwtAuthGuard)
    async getModelScript(
        @Query("scriptId") scriptId: string,
    ) {
        return await this.modelScriptService.getModelScript(scriptId);
    }

    @Get('get-file')
    @UseGuards(JwtAuthGuard)
    async getModelScriptFile(
        @Query('scriptId') scriptId: string,
        @Param("userId") userId: string,
    ) {
        return await this.modelScriptService.getModelScriptFile(userId, scriptId);
    }

    @Delete('delete')
    @UseGuards(JwtAuthGuard)
    async deleteModelScript(
        @Body('script_id') script_id: string,
    ) {
        return await this.modelScriptService.deleteModelScript(script_id);
    }
}
