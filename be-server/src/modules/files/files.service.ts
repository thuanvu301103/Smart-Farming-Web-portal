import { Injectable, NotFoundException } from '@nestjs/common';
import * as ftp from 'basic-ftp';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import * as fs from 'fs-extra';
import { Writable, Readable } from 'stream';

@Injectable()
export class FilesService {
    private ftpHost: string;
    private ftpUser: string;
    private ftpPassword: string;
    private ftpSecure: boolean;
    private ftpUploadDir: string;

    constructor(private readonly configService: ConfigService) {
        this.ftpHost = this.configService.get<string>('FTP_HOST');
        this.ftpUser = this.configService.get<string>('FTP_USER');
        this.ftpPassword = this.configService.get<string>('FTP_PASSWORD');
        this.ftpSecure = this.configService.get<boolean>('FTP_SECURE') || false;
        this.ftpUploadDir = this.configService.get<string>('FTP_UPLOAD_DIR') || '/uploads';
    }

    async connectToFTP() {
        const newFtpClient = new ftp.Client();
        await newFtpClient.access({
            host: this.ftpHost,
            user: this.ftpUser,
            password: this.ftpPassword,
            secure: this.ftpSecure,
        });
        return newFtpClient;
    }

    private generateNewFilename(originalname: string): string {
        return `v1.0${path.extname(originalname)}`;
    }

    async uploadFilesToFTP(files: Express.Multer.File[], remote_path: string) {
        const connect = await this.connectToFTP();
        try {
            await connect.ensureDir(remote_path);
            for (const file of files) {
                const remotePath = `${remote_path}/${file.originalname}`;
                await connect.uploadFrom(Readable.from(file.buffer), remotePath);
            }
        } catch (error) {
            console.error("❌ FTP Upload Error:", error);
            throw new Error("FTP Upload Failed");
        } finally {
            connect.close();
        }
    }

    async deleteFileFromFTP(remoteFilePath: string): Promise<void> {
        const connect = await this.connectToFTP();
        try {
            const exists = await this.checkFileExists(remoteFilePath, connect);
            if (!exists) {
                throw new NotFoundException(`File not found: ${remoteFilePath}`);
            }
            await connect.remove(remoteFilePath);
        } catch (error) {
            console.error("❌ Error deleting file:", error);
            throw new Error("File deletion failed");
        } finally {
            connect.close();
        }
    }

    async deleteFolderAndContents(remoteFolderPath: string): Promise<void> {
        const connect = await this.connectToFTP();
        try {
            await this.deleteFolderAndContentsRecur(remoteFolderPath, connect);
        } catch (error) {
            console.error("❌ Error deleting folder and its contents:", error);
            throw new Error("Folder deletion failed");
        } finally {
            connect.close();
        }
    }

    async deleteFolderAndContentsRecur(remoteFolderPath: string, ftpConnect): Promise<void> {
        try {
            const fileList = await ftpConnect.list(remoteFolderPath);
            for (const file of fileList) {
                const currentPath = `${remoteFolderPath}/${file.name}`;
                if (file.isDirectory) {
                    await this.deleteFolderAndContentsRecur(currentPath, ftpConnect);
                } else {
                    await ftpConnect.remove(currentPath);
                    console.log(`✅ Deleted file: ${currentPath}`);
                }
            }
            await ftpConnect.removeDir(remoteFolderPath);
        } catch (error) {
            console.error("❌ Error deleting folder and its contents:", error);
            throw new Error("Folder deletion failed");
        }
    }

    async getFolderContents(ftpFolderPath: string): Promise<any[]> {
        const connect = await this.connectToFTP();
        try {
            console.log(ftpFolderPath);
            const fileList = await connect.list(ftpFolderPath);
            console.log(`✅ Contents of folder ${ftpFolderPath}:`, fileList);
            return fileList;
        } catch (error) {
            console.error("❌ Error retrieving folder contents:", error);
            throw new Error("Failed to get folder contents");
        } finally {
            connect.close();
        }
    }

    async renameFile(oldFilePath: string, newFilePath: string) {
        const connect = await this.connectToFTP();
        try {
            await connect.rename(oldFilePath, newFilePath);
            return { message: "Renaming file succeeded" };
        } catch (error) {
            console.error("❌ Error renaming file:", error);
            throw new Error("Failed to rename");
        } finally {
            connect.close();
        }
    }

    async getFileContent(filePath: string): Promise<string | Buffer> {
        const connect = await this.connectToFTP();
        return await this.fetchFile(filePath, connect);
    }

    private async fetchFile(filePath: string, ftpConnect): Promise<string | Buffer> {
        try {
            const chunks: Buffer[] = [];
            const exists = await this.checkFileExists(filePath, ftpConnect);
            if (!exists) {
                throw new Error(`File not found: ${filePath}`);
            }
            const writable = new Writable({
                write(chunk, _, cb) {
                    chunks.push(chunk);
                    cb();
                },
            });
            await ftpConnect.download(writable, filePath);
            return Buffer.concat(chunks);
        } catch (error) {
            console.error("❌ Error fetching file:", error);
            throw new Error('Fail to fetch file');
        } finally {
            ftpConnect.close();
        }
    }

    private async checkFileExists(filePath: string, ftpConnect): Promise<boolean> {
        try {
            const dirPath = path.dirname(filePath);
            const fileName = path.basename(filePath);
            const fileList: ftp.FileInfo[] = await ftpConnect.list(dirPath);
            return fileList.some(file => file.name === fileName);
        } catch (error) {
            console.error("Error checking file existence:", error);
            return false;
        }
    }
}
