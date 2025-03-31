import {
    Injectable, Inject, forwardRef,
    NotFoundException, BadRequestException,
    InternalServerErrorException, 
    HttpException, HttpStatus,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Models } from '../../schemas/models.schema';
import { Script } from '../../schemas/scripts.schema';
import { ActivitiesService } from "../activities/activities.service";
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class ModelsService {

    private mlflowUrl: string;

    constructor(
        @InjectModel(Models.name) private modelModel: Model<Models>,
        @InjectModel(Script.name) private scriptModel: Model<Script>,
        @Inject(forwardRef(() => ActivitiesService)) private readonly activitiesService: ActivitiesService,
        private readonly configService: ConfigService,
    ) {
        this.mlflowUrl = this.configService.get<string>('MLFLOW_TRACKING_SERVER');
    }

    async isExist(obj_id) {
        return true;
    }

    /* ----- Registered Model ----- */
    // Create Registered Model
    async createRegisteredModel(
        userId: string,
        name: string,
        tags: { key: string, value: string }[],
        description: string
    ) {
        const unique_name = `${userId}/${name}`;
        try {
            const response = await axios.post(
                `${this.mlflowUrl}/api/2.0/mlflow/registered-models/create`,
                {
                    name: unique_name,
                    tags: tags,
                    description: description
                }
            );
            if (response.status !== 200) {
                throw new BadRequestException(`MLflow returned status ${response.status}`);
            }
            const savedModel = await this.modelModel.create({
                name: unique_name,
                owner_id: new Types.ObjectId(userId),
                creation_timestamp: response.data.registered_model.creation_timestamp,
                last_updated_timestamp: response.data.registered_model.last_updated_timestamp,
                description: response.data.registered_model.description,
            });

            return { mlflow: response.data, db: savedModel };
        } catch (error) {
            if (error.response) {
                throw new HttpException(
                    `MLflow Error: ${error.response.data.message || 'Unknown error'}`,
                    error.response.status || HttpStatus.INTERNAL_SERVER_ERROR
                );
            }
            throw new HttpException(
                `Failed to connect to MLflow API. Check your mlflowUrl.`,
                HttpStatus.SERVICE_UNAVAILABLE
            );
        }
    }

    // Get all Registered Model of a user
    async getAllRegisteredModels(userId: string) {
        const models = await this.modelModel.find({ owner_id: new Types.ObjectId(userId) }).exec();

        return models.map(model => ({
            ...model.toObject(),
            alt_name: model.name.includes("/") ? model.name.split("/").pop() : model.name
        }));
    }

    // Get a Registered Model by name
    async getRegisteredModel(userId: string, name: string) {
        const unique_name = `${userId}/${name}`;
        try {
            const response = await axios.get(
                `${this.mlflowUrl}/api/2.0/mlflow/registered-models/get`,
                { params: { name: unique_name } }
            );
            const model = await this.modelModel.findOne({ name: unique_name }).exec();
            response.data.registered_model['_id'] = model._id;
            return response.data;
        } catch (error) {
            if (error.response) {
                throw new HttpException(
                    `MLflow Error: ${error.response.data.message || 'Unknown error'}`,
                    error.response.status || HttpStatus.INTERNAL_SERVER_ERROR
                );
            }
            throw new HttpException(
                `Failed to connect to MLflow API. Check your mlflowUrl.`,
                HttpStatus.SERVICE_UNAVAILABLE
            );
        }
    }

    // Rename a Registered Model
    async renameRegisteredModel(userId: string, name: string, newName: string) {
        const unique_name = `${userId}/${name}`;
        const new_unique_name = `${userId}/${newName}`;
        const response = await axios.post(
            `${this.mlflowUrl}/api/2.0/mlflow/registered-models/rename`,
            {
                name: unique_name,
                new_name: new_unique_name,
            }
        );

        if (response.status !== 200) {
            throw new BadRequestException(`MLflow returned status ${response.status}`);
        }
        const updatedModelRes = await this.modelModel.updateOne(
            { name: unique_name },
            { $set: { name: new_unique_name } }
        );

        if (updatedModelRes.modifiedCount === 0) {
            throw new Error("No updates made");
        }

        return { message: "Model updated successfully" };
    }

    // Update a Registered Model
    async updateRegisteredModel(userId: string, name: string, description: string) {
        const unique_name = `${userId}/${name}`;
        const response = await axios.patch(
            `${this.mlflowUrl}/api/2.0/mlflow/registered-models/update`,
            {
                name: unique_name,
                description: description,
            }
        );

        if (response.status !== 200) {
            throw new BadRequestException(`MLflow returned status ${response.status}`);
        }
        const updatedModelRes = await this.modelModel.updateOne(
            { name: unique_name },
            { $set: { description: description } }
        );

        if (updatedModelRes.modifiedCount === 0) {
            throw new Error("No updates made");
        }

        return { message: "Model updated successfully" };
    }

    // Delete a Registered Model
    async deleteRegisteredModel(userId: string, name: string) {
        const unique_name = `${userId}/${name}`;
        const response = await axios.delete(
            `${this.mlflowUrl}/api/2.0/mlflow/registered-models/delete`,
            { data: { name: unique_name } }
        );
        console.log(response.status);
        if (response.status !== 200) {
            throw new BadRequestException(`MLflow returned status ${response.status}`);
        }
        const deleteResult = await this.modelModel.deleteOne({ name: unique_name });
        if (deleteResult.deletedCount === 0) {
            throw new Error("No model found for this owner");
        }
        return { message: "Model deleted successfully" };
    }

    // Get Latest Model Versions
    async getLatestModelVersions(
        userId: string,
        name: string,
        stages: string[]
    ) {
        try {
            const unique_name = `${userId}/${name}`;
            const response = await axios.post(
                `${this.mlflowUrl}/api/2.0/mlflow/registered-models/get-latest-versions`,
                {
                    name: unique_name,
                    stages: stages
                }
            );

            return response.data;
        } catch (error) {

            if (error.response) {
                throw new HttpException(
                    `MLflow Error: ${error.response.data.message || 'Unknown error'}`,
                    error.response.status || HttpStatus.INTERNAL_SERVER_ERROR
                );
            }

            throw new HttpException(
                `Failed to connect to MLflow API. Check your mlflowUrl.`,
                HttpStatus.SERVICE_UNAVAILABLE
            );
        }
    }

    // Get Latest Model Versions
    async getAllModelVersions(
        userId: string,
        name: string,
        page_token: string
    ) {
        try {
            const unique_name = `${userId}/${name}`;
            console.log("Page Token: ", page_token);
            console.log("Filter: ", `name='${unique_name}'`);
            const response = await axios.get(
                `${this.mlflowUrl}/api/2.0/mlflow/model-versions/search`,
                {
                    params: {
                        filter: `name='${unique_name}'`,  // Correct filter format
                        order_by: ["version DESC"],       // Uncomment and fix order_by syntax
                        max_results: 100,
                        page_token: Buffer.from(page_token, 'base64').toString('utf-8')
                    }
                }
            );

            return response.data;
        } catch (error) {

            if (error.response) {
                throw new HttpException(
                    `MLflow Error: ${error.response.data.message || 'Unknown error'}`,
                    error.response.status || HttpStatus.INTERNAL_SERVER_ERROR
                );
            }

            throw new HttpException(
                `Failed to connect to MLflow API. Check your mlflowUrl.`,
                HttpStatus.SERVICE_UNAVAILABLE
            );
        }
    }

    // Set Registered Model Tag
    async setRegisteredModelTag(
        userId: string,
        name: string,
        key: string,
        value: string
    ) {
        try {
            const unique_name = `${userId}/${name}`;
            const response = await axios.post(
                `${this.mlflowUrl}/api/2.0/mlflow/registered-models/set-tag`,
                {
                    name: unique_name,
                    key: key,
                    value: value
                }
            );
            return response.data;
        } catch (error) {
            if (error.response) {
                throw new HttpException(
                    `MLflow Error: ${error.response.data.message || 'Unknown error'}`,
                    error.response.status || HttpStatus.INTERNAL_SERVER_ERROR
                );
            }
            throw new HttpException(
                `Failed to connect to MLflow API. Check your mlflowUrl.`,
                HttpStatus.SERVICE_UNAVAILABLE
            );
        }
    }

    // Delete Registered Model Tag
    async deleteRegisteredModelTag(
        userId: string,
        name: string,
        key: string
    ) {
        try {
            const unique_name = `${userId}/${name}`;
            const response = await axios.delete(
                `${this.mlflowUrl}/api/2.0/mlflow/registered-models/delete-tag`,
                {
                    data: {
                        name: unique_name,
                        key: key
                    }
                }
            );
            return response.data;
        } catch (error) {
            if (error.response) {
                throw new HttpException(
                    `MLflow Error: ${error.response.data.message || 'Unknown error'}`,
                    error.response.status || HttpStatus.INTERNAL_SERVER_ERROR
                );
            }
            throw new HttpException(
                `Failed to connect to MLflow API. Check your mlflowUrl.`,
                HttpStatus.SERVICE_UNAVAILABLE
            );
        }
    }

    // Set Model schedule
    async setModelSchedule(model_id: string, cron_string: string) {
        const existingModel = await this.modelModel.findById(model_id).exec();
        //console.log(existingModel);
        if (existingModel == null) {
            //console.log("Throwing");
            throw new NotFoundException(`Model with ID ${model_id} not found`);
        }
        try {
            await this.modelModel.findByIdAndUpdate(
                model_id,
                { schedule: cron_string },
                { new: true }
            ).exec();

        } catch (error) {
            throw new InternalServerErrorException(`Error while setting model schedule: ${model_id}`)
        }
    }

    // get Model schedule
    async getModelSchedule(model_id: string) {
        const existingModel = await this.modelModel.findById(model_id).select("schedule").exec();
        if (existingModel == null) {
            throw new NotFoundException(`Model with ID ${model_id} not found`);
        }
        return existingModel;
    }

    /* ----- Registered Model Version ----- */
    // Create Model Version
    async createModelVersion(
        userId: string,
        name: string,
        source: string,
        run_id: string,
        tags: string[],
        run_link: string,
        description: string
    ) {
        try {
            const unique_name = `${userId}/${name}`;
            const response = await axios.post(
                `${this.mlflowUrl}/api/2.0/mlflow/model-versions/create`,
                {
                    name: unique_name,
                    source: source,
                    run_id: run_id,
                    tags: tags,
                    run_link: run_link,
                    description: description
                }
            );
            
            return response.data;
        } catch (error) {
            
            if (error.response) {
                throw new HttpException(
                    `MLflow Error: ${error.response.data.message || 'Unknown error'}`,
                    error.response.status || HttpStatus.INTERNAL_SERVER_ERROR
                );
            }

            throw new HttpException(
                `Failed to connect to MLflow API. Check your mlflowUrl.`,
                HttpStatus.SERVICE_UNAVAILABLE
            );
        }
    }

    // Get Model Version
    async getModelVersion(
        userId: string,
        name: string,
        version: string
    ) {
        try {
            const unique_name = `${userId}/${name}`;
            const response = await axios.get(
                `${this.mlflowUrl}/api/2.0/mlflow/model-versions/get`,
                {
                    params: {
                        name: unique_name,
                        version: version
                    }
                }
            );

            return response.data;
        } catch (error) {

            if (error.response) {
                throw new HttpException(
                    `MLflow Error: ${error.response.data.message || 'Unknown error'}`,
                    error.response.status || HttpStatus.INTERNAL_SERVER_ERROR
                );
            }

            throw new HttpException(
                `Failed to connect to MLflow API. Check your mlflowUrl.`,
                HttpStatus.SERVICE_UNAVAILABLE
            );
        }
    }

    // Get Model Version
    async updateModelVersion(
        userId: string,
        name: string,
        version: string,
        description: string
    ) {
        try {
            const unique_name = `${userId}/${name}`;
            const response = await axios.patch(
                `${this.mlflowUrl}/api/2.0/mlflow/model-versions/update`,
                {
                    name: unique_name,
                    version: version,
                    description: description
                }
            );

            return response.data;
        } catch (error) {

            if (error.response) {
                throw new HttpException(
                    `MLflow Error: ${error.response.data.message || 'Unknown error'}`,
                    error.response.status || HttpStatus.INTERNAL_SERVER_ERROR
                );
            }

            throw new HttpException(
                `Failed to connect to MLflow API. Check your mlflowUrl.`,
                HttpStatus.SERVICE_UNAVAILABLE
            );
        }
    }

    // Update Model Version
    async deleteModelVersion(
        userId: string,
        name: string,
        version: string
    ) {
        try {
            const unique_name = `${userId}/${name}`;
            const response = await axios.delete(
                `${this.mlflowUrl}/api/2.0/mlflow/model-versions/delete`,
                { data: { name: unique_name, version: version } }
            );
            return response.data;
        } catch (error) {
            if (error.response) {
                throw new HttpException(
                    `MLflow Error: ${error.response.data.message || 'Unknown error'}`,
                    error.response.status || HttpStatus.INTERNAL_SERVER_ERROR
                );
            }
            throw new HttpException(
                `Failed to connect to MLflow API. Check your mlflowUrl.`,
                HttpStatus.SERVICE_UNAVAILABLE
            );
        }

    }

    // Set Model Version Tag
    async setModelVersionTag(
        userId: string,
        name: string,
        version: string,
        key: string,
        value: string
    ) {
        try {
            const unique_name = `${userId}/${name}`;
            const response = await axios.post(
                `${this.mlflowUrl}/api/2.0/mlflow/model-versions/set-tag`,
                {
                    name: unique_name,
                    version: version,
                    key: key,
                    value: value
                }
            );
            return response.data;
        } catch (error) {
            if (error.response) {
                throw new HttpException(
                    `MLflow Error: ${error.response.data.message || 'Unknown error'}`,
                    error.response.status || HttpStatus.INTERNAL_SERVER_ERROR
                );
            }
            throw new HttpException(
                `Failed to connect to MLflow API. Check your mlflowUrl.`,
                HttpStatus.SERVICE_UNAVAILABLE
            );
        }
    }

    // Delete Model Version Tag
    async deleteModelVersionTag(
        userId: string,
        name: string,
        version: string,
        key: string
    ) {
        try {
            const unique_name = `${userId}/${name}`;
            const response = await axios.delete(
                `${this.mlflowUrl}/api/2.0/mlflow/model-versions/delete-tag`,
                {
                    data: {
                        name: unique_name,
                        version: version,
                        key: key
                    }
                }
            );
            return response.data;
        } catch (error) {
            if (error.response) {
                throw new HttpException(
                    `MLflow Error: ${error.response.data.message || 'Unknown error'}`,
                    error.response.status || HttpStatus.INTERNAL_SERVER_ERROR
                );
            }
            throw new HttpException(
                `Failed to connect to MLflow API. Check your mlflowUrl.`,
                HttpStatus.SERVICE_UNAVAILABLE
            );
        }
    }
}
