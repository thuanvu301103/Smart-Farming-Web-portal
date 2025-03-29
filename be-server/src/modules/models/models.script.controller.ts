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

const storage = multer.diskStorage({
    destination: path.join(__dirname, "./../uploads"), // Temporary folder
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${uuidv4()}`; // Timestamp + UUID
        const extension = path.extname(file.originalname);
        const newFilename = `${path.basename(file.originalname, extension)}-${uniqueSuffix}${extension}`;
        cb(null, newFilename);
    }
});

@Controller(':userId/models/scripts')
export class ModelScriptsController {
    constructor(private readonly modelScriptService: ModelScriptsService) { }

    @Post('upload')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FilesInterceptor('files', 50, { storage }))
    async uploadModelScript(
        @UploadedFiles() files: Express.Multer.File[],
        @Body('version') version: string,
        @Body('model_id') model_id: string,
        @Body('model_version') model_version: string,
        @Req() req
    ) {
        //console.log(version, model_id);
        const currentUserId = req.user.userId;
        try {
            await this.modelScriptService.uploadModelScript(files, version, currentUserId, model_id, model_version);
        } catch (error) {
            throw error;
        }
        return { message: 'Files uploaded successfully to Server' };
    }

    @Get('get-all')
    @UseGuards(JwtAuthGuard)
    async getAllModelScripts(
        @Query('model_id') model_id: string,
    ) {
        return await this.modelScriptService.getAllModelScripts(model_id);
    }

    @Get('get')
    @UseGuards(JwtAuthGuard)
    async getModelScript(
        @Query('model_id') model_id: string,
        @Query('version') version: string,
        @Req() req
    ) {
        const currentUserId = req.user.userId;
        return await this.modelScriptService.getModelScript(currentUserId, model_id, version);
    }

    @Delete('delete')
    @UseGuards(JwtAuthGuard)
    async deleteModelScript(
        @Body('script_id') script_id: string,
        @Req() req
    ) {
        const currentUserId = req.user.userId;
        return await this.modelScriptService.deleteModelScript(currentUserId, script_id);
    }
}
