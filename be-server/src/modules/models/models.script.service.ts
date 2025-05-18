import {
    Injectable, Inject, forwardRef,
    NotFoundException, BadRequestException,
    ConflictException,
    InternalServerErrorException,
    HttpException, HttpStatus,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Models } from '../../schemas/models.schema';
import { ModelScript } from '../../schemas/models.scripts.schema';
import { FilesService } from "../files/files.service";
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Readable } from 'stream';
// DTO
import { BaseSearchModelScriptQueryDto } from '../../dto/model.scripts.dto';

function bufferToStream(buffer: Buffer) {
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);
    return stream;
}

@Injectable()
export class ModelScriptsService {

    private python_server: string = 'http://10.1.8.52:7000';
    
    constructor(
        @InjectModel(Models.name) private modelModel: Model<Models>,
        @InjectModel(ModelScript.name) private modelScriptModel: Model<ModelScript>,
        @Inject(FilesService) private readonly filesService: FilesService,
        private readonly configService: ConfigService,
    ) { }

    /*----- Model Script -----*/
    async genScript(
        userId: string,
        name: string,
        version: string,
        location: string,
        temp: number,
        humid: number,
        rainfall: number
    ) {
        try {
            const response = await axios.post(
                `${this.python_server}/model-versions/generate`,
                { 
                    name: name, 
                    version: version,
                    location: location,
                    temp: temp,
                    humid: humid,
                    rainfall: rainfall 
                }
            );
            if (response.status !== 200) {
                throw new BadRequestException(`PythonServer returned status ${response.status}`);
            }
            const fileBuffer = Buffer.from(response.data, 'utf-8');
            const newModelScript = new this.modelScriptModel({
                model_name: name,
                model_version: version,
                location: location,
                avg_temp: temp,
                avg_humid: humid,
                avg_rainfall: rainfall,
                owner_id: new Types.ObjectId(userId)
            })
            const savedModelScript = await newModelScript.save();
            const scriptFile: Express.Multer.File = {
                fieldname: 'file',
                originalname: `${savedModelScript._id}.json`,
                encoding: '7bit',
                mimetype: 'application/json',
                size: fileBuffer.length,
                buffer: fileBuffer,
                stream: bufferToStream(fileBuffer),
                destination: '',
                filename: '',
                path: ''
            };
            const scriptFiles: Express.Multer.File[] = [scriptFile];
            await this.filesService.uploadFilesToFTP(scriptFiles, `/${userId}/model/${name}/script`);
            return savedModelScript;
        } catch (error) {
            if (error.response) {
                throw new HttpException(
                    `Python Server Error: ${error.response.data.message || 'Unknown error'}`,
                    error.response.status || HttpStatus.INTERNAL_SERVER_ERROR
                );
            }
            throw new HttpException(
                `Failed to connect to Python Server API. Check your pythonUrl.`,
                HttpStatus.SERVICE_UNAVAILABLE
            );
        }
    }

    //////////////////////////////////////////////////////////////////////////
    
    // Upload Model Script
    async uploadModelScript(scriptFiles, version, user_id, model_id, model_version) {
        if (await this.isVersionExist(model_id, version)) {
            throw new ConflictException(`Model Script Version ${version} already exists`);
        }
        const newModelScript = new this.modelScriptModel({
            //version: version,
            //model_id: new Types.ObjectId(model_id),
            model_version: model_version
        })
        const savedModelScript = await newModelScript.save();
        for (const file of scriptFiles) {
            file.originalname = `version${version}.json`
        }
        console.log("DYNAMIC FILE", scriptFiles)
        if (savedModelScript && savedModelScript._id) {
            await this.filesService.uploadFilesToFTP(scriptFiles, `/${user_id}/model/${model_id}/script`)
        } else {
            throw new InternalServerErrorException('Error while saving Model Script');
        }
    }

    // Check if Model Script / Version is exist or not
    async isVersionExist(model_id, version) {
        return true;
    }

    // get all Model Script stored in user'side
    async getAllModelScripts(owner_id: string, query: BaseSearchModelScriptQueryDto) {
        const {
                page, limit,
                sortBy, order,
                location, model_name
            } = query;
        const filterCondition: any = {};
        filterCondition.owner_id = new Types.ObjectId(owner_id)
        if (location) {
            filterCondition.location = location;
        }
        if (model_name) {
            filterCondition.model_name = model_name;
        }
        const sortOrder = order === 'asc' ? 1 : -1;
        const skip = (page - 1) * limit;
        const scripts = await this.modelScriptModel.find(filterCondition)
            .sort({ [sortBy]: sortOrder })
            .skip(skip)
            .limit(limit).lean()
            .exec();

        const total = await this.modelScriptModel.countDocuments(filterCondition);
           return {
                data: scripts,
                total,
                page,
                totalPages: Math.ceil(total / limit),
            };
    }

    // get a Model Script MetaData
    async getModelScript(script_id) {
        const script = await this.modelScriptModel.findById(script_id).lean().exec();
        return script;
    }

    // get a Model Script File
    async getModelScriptFile(user_id, script_id) {
        const script = await this.modelScriptModel.findById(script_id).lean().exec();
        const model_name = script.model_name;
        return await this.filesService.getFileContent(`${user_id}/model/${model_name}/script/${script_id}.json`);
    }

    // Delete scripts
    async deleteModelScript(script_id) {
        const deletedModelScript = await this.modelScriptModel.findByIdAndDelete(script_id);
        if (deletedModelScript) {
            await this.filesService.deleteFileFromFTP(`/${userId}/model/${deletedModelScript.model_name}/script/${script_id}.json`)
        } else {
            throw new InternalServerErrorException('Error while deleting Model Script');
        }
    }
}
