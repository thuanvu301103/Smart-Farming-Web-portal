import { Injectable } from '@nestjs/common';
import * as ftp from 'basic-ftp';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import * as fs from 'fs-extra';

@Injectable()
export class FilesService {
    private ftpClient: ftp.Client;
    private ftpHost: string;
    private ftpUser: string;
    private ftpPassword: string;
    private ftpSecure: boolean;
    private ftpUploadDir: string;

    constructor(private readonly configService: ConfigService) {
        this.ftpClient = new ftp.Client();
        this.ftpClient.ftp.verbose = true; // Enable logs for debugging
        // Load FTP credentials from .env
        this.ftpHost = this.configService.get<string>('FTP_HOST');
        this.ftpUser = this.configService.get<string>('FTP_USER');
        this.ftpPassword = this.configService.get<string>('FTP_PASSWORD');
        this.ftpSecure = this.configService.get<boolean>('FTP_SECURE') || false;
        this.ftpUploadDir = this.configService.get<string>('FTP_UPLOAD_DIR') || '/uploads';
    }

    async connectToFTP() {
        await this.ftpClient.access({
            host: this.ftpHost,
            user: this.ftpUser,
            password: this.ftpPassword,
            secure: this.ftpSecure,
        });
        //console.log(`✅ Connected to FTP: ${this.ftpHost}`);
    }

    async uploadFilesToFTP(files: Express.Multer.File[], remote_path: string) {
        try {
            await this.connectToFTP();

            // Ensure remote directory exists
            //await this.ftpClient.ensureDir(this.ftpUploadDir);
            await this.ftpClient.ensureDir(remote_path);

            for (const file of files) {
                const localPath = path.join(__dirname, "./../uploads", file.filename);
                //const remotePath = `${this.ftpUploadDir}/${file.originalname}`;
                const remotePath = `${remote_path}/${file.originalname}`;

                // Upload file to FTP
                await this.ftpClient.uploadFrom(localPath, remotePath);
                console.log(`✅ Uploaded: ${file.originalname} to ${remotePath}`);

                // Delete local file after upload
                await fs.remove(localPath);
                console.log(`🗑️ Deleted local file: ${file.originalname}`);
            }

            this.ftpClient.close();
            console.log("✅ All files uploaded and deleted successfully");
        } catch (error) {
            console.error("❌ FTP Upload Error:", error);
            this.ftpClient.close();
            throw new Error("FTP Upload Failed");
        }
    }

    // Delete a file from FTP Server
    async deleteFileFromFTP(remoteFilePath: string): Promise<void> {
        try {
            // Connect to FTP Server
            await this.connectToFTP();

            // Delete the file from FTP
            await this.ftpClient.remove(remoteFilePath);
            console.log(`✅ Deleted file: ${remoteFilePath}`);
        } catch (error) {
            console.error("❌ Error deleting file:", error);
            throw new Error("File deletion failed");
        } finally {
            this.ftpClient.close();
        }
    }

    // delete a folder and its contents
    async deleteFolderAndContents(remoteFolderPath: string): Promise<void> {
        try {
            // Connect to FTP Server
            await this.connectToFTP();
            await this.deleteFolderAndContentsRecur(remoteFolderPath);
        } catch (error) {
            console.error("❌ Error deleting folder and its contents:", error);
            throw new Error("Folder deletion failed");
        } finally {
            this.ftpClient.close();
        }
    }

    // Recursively delete a folder and its contents
    async deleteFolderAndContentsRecur(remoteFolderPath: string): Promise<void> {
        try {

            // List the contents of the folder
            const fileList = await this.ftpClient.list(remoteFolderPath);

            // Iterate through each file/folder in the directory
            for (const file of fileList) {
                const currentPath = `${remoteFolderPath}/${file.name}`;

                if (file.isDirectory) {
                    // If the item is a folder, recursively delete its contents first
                    await this.deleteFolderAndContentsRecur(currentPath);
                } else {
                    // If the item is a file, delete it
                    await this.ftpClient.remove(currentPath);
                    console.log(`✅ Deleted file: ${currentPath}`);
                }
            }

            // After deleting all files and subdirectories, remove the directory itself
            await this.ftpClient.removeDir(remoteFolderPath);
            console.log(`✅ Deleted folder: ${remoteFolderPath}`);
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

    // Get file content from FTP
    async getFileContent(filePath: string): Promise<string | Buffer> {
        try {
            await this.connectToFTP();

            // Local path to temporarily store the file
            const localPath = path.join(__dirname, "./../downloads");
            console.log(localPath);

            // Download the file to a local folder (temporarily)
            await this.ftpClient.downloadTo(localPath, filePath);

            // Read the file content and return it
            const content = await fs.readFile(localPath, 'utf8');

            // Optionally, delete the local file after reading
            await fs.remove(localPath);

            console.log(`✅ File content fetched successfully from: ${filePath}`);
            return content;
        } catch (error) {
            console.error("❌ FTP Download Error:", error);
            throw new Error("FTP File Fetch Failed");
        } finally {
            this.ftpClient.close();
        }
    }
}