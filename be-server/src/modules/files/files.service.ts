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
    //private queue: any;

    constructor(private readonly configService: ConfigService) {
        this.ftpHost = this.configService.get<string>('FTP_HOST');
        this.ftpUser = this.configService.get<string>('FTP_USER');
        this.ftpPassword = this.configService.get<string>('FTP_PASSWORD');
        this.ftpSecure = this.configService.get<boolean>('FTP_SECURE') || false;
        this.ftpUploadDir = this.configService.get<string>('FTP_UPLOAD_DIR') || '/uploads';
        //this.queue = Promise.resolve()
    }

    async connectToFTP() {
        const newFtpClient = new ftp.Client();
        newFtpClient.ftp.verbose = true; // Enable logs for debugging

        try {
            await newFtpClient.access({
                host: this.ftpHost,
                user: this.ftpUser,
                password: this.ftpPassword,
                secure: this.ftpSecure,
            });
            console.log(`✅ Connected to FTP: ${this.ftpHost}`);
            return newFtpClient;
        } catch (error) {
            console.error("❌ FTP Connection Error:", error);
            throw new Error("Failed to connect to FTP server");
        }
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
                if (file.buffer && file.buffer.length > 0) {
                    // Upload from memory buffer
                    await connect.uploadFrom(Readable.from(file.buffer), remotePath);
                } else if (file.path) {
                    const fileContent = fs.readFileSync(file.path, 'utf-8');

                    try {
                        const json = JSON.parse(fileContent);
                        console.log('Parsed JSON:', json);
                        await connect.uploadFrom(Readable.from(fileContent), remotePath);
                    } catch (err) {
                        console.error(`Invalid JSON in file ${file.originalname}`);
                        throw err;
                    }
                } else {
                    console.warn(`⚠️ Skipping file "${file.originalname}" due to missing buffer and path.`);
                }
            }
            //console.log("✅ All files uploaded and deleted successfully");
        } catch (error) {
            console.error("❌ FTP Upload Error:", error);
            throw new Error("FTP Upload Failed");
        } finally {
            connect.close();
        }
    }

    // Delete a file from FTP Server
    async deleteFileFromFTP(remoteFilePath: string): Promise<void> {
        const connect = await this.connectToFTP();
        try {
            const exists = await this.checkFileExists(remoteFilePath, connect);
            //console.log("Exist: ", exists);
            if (!exists) {
                throw new NotFoundException(`File not found: ${remoteFilePath}`);
            }

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
        let connect: ftp.Client;
        console.log(`📂 Attempting to get folder contents for: "${ftpFolderPath}"`);
        try {
            console.log("🔌 Connecting to FTP server...");
            connect = await this.connectToFTP();
            console.log("✅ FTP connection established");

            // Get the list of files and directories in the specified folder
            const fileList = await connect.list(ftpFolderPath);
            console.log(`✅ Contents of folder "${ftpFolderPath}":`, fileList);

            return fileList;
        } catch (error) {
            console.error("❌ Error retrieving folder contents:", error);
            throw new Error("Failed to get folder contents");
        } finally {
            if (connect) {
                connect.close();
                console.log("🔌 FTP connection closed");
            }
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
    }

    // Get file content from FTP
    async getFileContent(filePath: string): Promise<string | Buffer> {
        const connect = await this.connectToFTP();
        try {
            return await this.fetchFile(filePath, connect);
        } catch (error) {
            console.error("❌ Error getting file content:", error);
            throw new Error('Fail to fetch file');
        } finally {
            connect.close();
        }
    }

    private async fetchFile(filePath: string, ftpConnect): Promise<string | Buffer> {
        try {
            const chunks: Buffer[] = [];
            // Check file exist
            const exists = await this.checkFileExists(filePath, ftpConnect);
            //console.log("Exist: ", exists);
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