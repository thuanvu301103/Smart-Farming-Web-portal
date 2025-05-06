import { Injectable, NotFoundException } from '@nestjs/common';
import * as ftp from 'basic-ftp';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import * as fs from 'fs-extra';
import { Writable, Readable } from 'stream';

@Injectable()
export class FilesService {
    private ftpClient: ftp.Client;
    private ftpHost: string;
    private ftpUser: string;
    private ftpPassword: string;
    private ftpSecure: boolean;
    private ftpUploadDir: string;
    private ftpPassiveMode: boolean;
    private ftpPassivePortMin: number;
    private ftpPassivePortMax: number;
    //private queue: any;

    constructor(private readonly configService: ConfigService) {
        //this.ftpClient = new ftp.Client();
        //this.ftpClient.ftp.verbose = true; // Enable logs for debugging
        this.ftpHost = this.configService.get<string>('FTP_HOST');
        this.ftpUser = this.configService.get<string>('FTP_USER');
        this.ftpPassword = this.configService.get<string>('FTP_PASSWORD');
        this.ftpSecure = this.configService.get<boolean>('FTP_SECURE') || false;
        this.ftpUploadDir = this.configService.get<string>('FTP_UPLOAD_DIR') || '/uploads';
        this.ftpPassiveMode = this.configService.get<boolean>('FTP_PASSIVE_MODE') || false;
        this.ftpPassivePortMin = this.configService.get<number>('FTP_PASSIVE_PORT_MIN') || 30000;
        this.ftpPassivePortMax = this.configService.get<number>('FTP_PASSIVE_PORT_MAX') || 31000;
        //this.queue = Promise.resolve()
    }

    async connectToFTP() {
        const newFtpClient = new ftp.Client();
        //console.log(`✅ Connected to FTP: ${this.ftpHost}`);
        // Enable passive mode if configured in environment variables
        if (this.ftpPassiveMode) {
            newFtpClient.ftp.passive = true;
            newFtpClient.ftp.passivePorts = [this.ftpPassivePortMin, this.ftpPassivePortMax]; // Set the passive port range
        }

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

            // Ensure remote directory exists
            await connect.ensureDir(remote_path);
            for (const file of files) {
                const remotePath = `${remote_path}/${file.originalname}`;
                await connect.uploadFrom(Readable.from(file.buffer), remotePath);
            }
            //console.log("✅ All files uploaded and deleted successfully");
        } catch (error) {
            connect.close();
            console.error("❌ FTP Upload Error:", error);
            throw new Error("FTP Upload Failed");
        }
        connect.close();

    }

    // Delete a file from FTP Server
    async deleteFileFromFTP(remoteFilePath: string): Promise<void> {
        const connect = await this.connectToFTP();
        const exists = await this.checkFileExists(remoteFilePath, connect);
        //console.log("Exist: ", exists);
        if (!exists) {
            connect.close();
            throw new NotFoundException(`File not found: ${remoteFilePath}`);
        }
        try {
            // Delete the file from FTP
            await connect.remove(remoteFilePath);
        } catch (error) {
            console.error("❌ Error deleting file:", error);
            throw new Error("File deletion failed");
        } finally {
            connect.close();
        }
    }

    // delete a folder and its contents
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

    // Recursively delete a folder and its contents
    async deleteFolderAndContentsRecur(remoteFolderPath: string, ftpConnect): Promise<void> {
        try {

            // List the contents of the folder
            const fileList = await ftpConnect.list(remoteFolderPath);

            // Iterate through each file/folder in the directory
            for (const file of fileList) {
                const currentPath = `${remoteFolderPath}/${file.name}`;

                if (file.isDirectory) {
                    // If the item is a folder, recursively delete its contents first
                    await this.deleteFolderAndContentsRecur(currentPath, ftpConnect);
                } else {
                    // If the item is a file, delete it
                    await ftpConnect.remove(currentPath);
                    console.log(`✅ Deleted file: ${currentPath}`);
                }
            }

            // After deleting all files and subdirectories, remove the directory itself
            await ftpConnect.removeDir(remoteFolderPath);
            //console.log(`✅ Deleted folder: ${remoteFolderPath}`);
        } catch (error) {
            console.error("❌ Error deleting folder and its contents:", error);
            throw new Error("Folder deletion failed");
        }
    }

    // Get the contents of a folder on FTP server
    async getFolderContents(ftpFolderPath: string): Promise<any[]> {
        try {
            // Connect to FTP Server
            await this.connectToFTP();
            console.log(ftpFolderPath);
            // Get the list of files and directories in the specified folder
            const fileList = await this.ftpClient.list(ftpFolderPath);
            console.log(`✅ Contents of folder ${ftpFolderPath}:`, fileList);

            // Return the file/folder list
            return fileList;

        } catch (error) {
            console.error("❌ Error retrieving folder contents:", error);
            throw new Error("Failed to get folder contents");
        } finally {
            this.ftpClient.close();
        }
    }

    // Rename a file
    async renameFile(oldFilePath: string, newFilePath: string) {
        const connect = await this.connectToFTP();
        try {
            await connect.rename(oldFilePath, newFilePath);
            //console.log(`✅ Rename ${oldFilePath}:`, newFilePath);
            return { message: "Renaming file successed" }

        } catch (error) {
            //console.error("❌ Error renaming file:", error);
            throw new Error("Failed to get rename");
        } finally {
            connect.close();
        }
        //});
    }

    // Get file content from FTP
    async getFileContent(filePath: string): Promise<string | Buffer> {
        const connect = await this.connectToFTP();
        return await this.fetchFile(filePath, connect);
    }

    private async fetchFile(filePath: string, ftpConnect): Promise<string | Buffer> {
        try {
            const chunks: Buffer[] = [];
            // Check file exist
            const exists = await this.checkFileExists(filePath, ftpConnect);
            //console.log("Exist: ", exists);
            if (!exists) {
                ftpConnect.close();
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
            //console.log("dirPath: ", dirPath, "; filePath: ", filePath);
            const fileList: ftp.FileInfo[] = await ftpConnect.list(dirPath);
            //console.log(fileList);
            return fileList.some(file => file.name === fileName);
        } catch (error) {
            console.error("Error checking file existence:", error);
            return false;
        }
    }
}