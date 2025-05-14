import {
    Controller,
    Post, Delete, Get, Put,
    Body, Query, Param, Req, Res,
    UploadedFiles, UseInterceptors,
    UseGuards, ForbiddenException, BadRequestException
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { FilesService } from './files.service';
import { JwtAuthGuard } from "./../auth/jwt-auth.guard";


const storage = multer.memoryStorage();

@Controller('files')
export class FilesController {
    constructor(private readonly filesService: FilesService) { }

    @Post('upload')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FilesInterceptor('files', 50, { storage }))
    async uploadFiles(
        @UploadedFiles() files: Express.Multer.File[],
        @Body('remote_path') remotePath: string,
        @Req() req
    ) {
        if (!files || !files.length) {
            throw new BadRequestException('No files uploaded');
        }
        const parts = remotePath.split("/");
        const userId = parts[1];
        const currentUserId = req.user.userId; // Get the current user from JWT
        //console.log(userId, currentUserId);
        // Ensure users can only modify their own favorites
        if (currentUserId !== userId) {
            throw new ForbiddenException('You can only upload your own file.');
        }
        console.log("STATIC FILES", files)
        await this.filesService.uploadFilesToFTP(files, remotePath);
        return { message: 'Files uploaded successfully to FTP' };
    }

    @Delete('deleteFile')
    async deleteFile(@Query('path') filePath: string) {
        await this.filesService.deleteFileFromFTP(filePath);
        return { message: 'Delete file successfully' };
    }

    @Delete('deleteFolder')
    async deleteFolder(@Query('path') filePath: string) {
        await this.filesService.deleteFolderAndContents(filePath);
        return { message: 'Delete folder successfully' };
    }

    @Get('folder-contents/:folderPath(*)')
    async getFolderContents(@Param('folderPath') folderPath: string) {
        try {
            const contents = await this.filesService.getFolderContents(folderPath);
            return { message: "Folder contents fetched successfully", contents };
        } catch (error) {
            return { message: "Failed to fetch folder contents", error: error.message };
        }
    }

    // Endpoint to get file content from FTP
    @Get('file-content/:path(*)')
    @UseGuards(JwtAuthGuard)
    async getFileContent(
        @Param('path') filePath: string,
        @Req() req,
        @Res() res,
    ) {
        const buffer = await this.filesService.getFileContent(filePath);
        const filename = filePath.split('/').pop() || 'file.json';

        // Xác định Content-Type dựa trên phần mở rộng của file
        const isJson = filename.endsWith('.json');
        const contentType = isJson ? 'application/json' : 'application/octet-stream';

        res.set({
            'Content-Type': contentType,
            'Content-Disposition': `attachment; filename="${filename}"`,
            'Content-Length': Buffer.isBuffer(buffer) ? buffer.length : Buffer.byteLength(JSON.stringify(buffer)),
        });

        // Nếu là JSON object → stringify, còn lại thì gửi buffer
        const responseContent = Buffer.isBuffer(buffer) ? buffer : JSON.stringify(buffer);
        res.send(responseContent);
    }


    // Endpoint to get file content from FTP
    @Put('rename')
    @UseGuards(JwtAuthGuard)
    async renameFile(
        @Body() body: { old_path: string; new_path: string },
        @Req() req
    ) {

        return await this.filesService.renameFile(body.old_path, body.new_path);
    }
}