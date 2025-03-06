import {
    Controller,
    Post, Delete, Get,
    Body, Query, Param, Req,
    UploadedFiles, UseInterceptors,
    UseGuards, ForbiddenException
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { FilesService } from './files.service';
import { JwtAuthGuard } from "./../auth/jwt-auth.guard";


const storage = multer.diskStorage({
    destination: path.join(__dirname, "./../uploads"), // Temporary folder
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${uuidv4()}`; // Timestamp + UUID
        const extension = path.extname(file.originalname);
        const newFilename = `${path.basename(file.originalname, extension)}-${uniqueSuffix}${extension}`;
        cb(null, newFilename);
    }
});

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
        const parts = remotePath.split("/");
        const userId = parts[1];
        const currentUserId = req.user.userId; // Get the current user from JWT
        // Ensure users can only modify their own favorites
        if (currentUserId !== userId) {
            throw new ForbiddenException('You can only upload your own file.');
        }

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

    @Get('folder-contents/:folderPath')
    async getFolderContents(@Param('folderPath') folderPath: string) {
        try {
            const contents = await this.filesService.getFolderContents(folderPath);
            return { message: "Folder contents fetched successfully", contents };
        } catch (error) {
            return { message: "Failed to fetch folder contents", error: error.message };
        }
    }

    // Endpoint to get file content from FTP
    @Get('file-content/:path')
    @UseGuards(JwtAuthGuard)
    async getFileContent(
        @Param('path') filePath: string,
        @Req() req
    ) {
        console.log("Get file Content");
        /*
        const parts = filePath.split("%2F");
        const userId = parts[1];
        const currentUserId = req.user.userId; // Get the current user from JWT
        // Ensure users can only modify their own favorites
        if (currentUserId !== userId) {
            throw new ForbiddenException('You can only upload your own file.');
        }
        */
        //console.log('Requested file path:', filePath);
        return await this.filesService.getFileContent(filePath);
    }
}