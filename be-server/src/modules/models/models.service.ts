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
import { Register } from '../../schemas/register.schema';
import { ActivitiesService } from "../activities/activities.service";
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import cronParser from 'cron-parser';
// DTO
import { BaseSearchModelQueryDto } from '../../dto/models.dto';

@Injectable()
export class ModelsService {

    private mlflowUrl: string;
    private python_server: string = 'http:10.1.8.52:7000';

    constructor(
        @InjectModel(Models.name) private modelModel: Model<Models>,
        @InjectModel(Script.name) private scriptModel: Model<Script>,
        @InjectModel(Register.name) private registerModel: Model<Register>,
        @Inject(forwardRef(() => ActivitiesService)) private readonly activitiesService: ActivitiesService,
        private readonly configService: ConfigService,
    ) {
        this.mlflowUrl = this.configService.get<string>('MLFLOW_TRACKING_SERVER');
        console.log('MLFlow URL when call', this.mlflowUrl)
    }

    async isExist(obj_id) {
        return true;
    }

    /* ----- Registered Model ----- */
    // Create Model
    async createModel(
        name: string,
        tags: { key: string, value: string }[],
        description: string
    ) {
        //console.log("Creating new Model: ", name, '-', description);
        try {
            const response = await axios.post(
                `${this.mlflowUrl}/api/2.0/mlflow/registered-models/create`,
                {
                    name: name,
                    tags: tags,
                    description: description
                }
            );
            if (response.status !== 200) {
                throw new BadRequestException(`MLflow returned status ${response.status}`);
            }
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

    // Get Model
    async getModel(
        name: string
    ) {
        try {
            const response = await axios.get(
                `${this.mlflowUrl}/api/2.0/mlflow/registered-models/get`,
                { params: { name: name } }
            );
            if (response.status !== 200) {
                throw new BadRequestException(`MLflow returned status ${response.status}`);
            }
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

    // Rename Model
    async renameModel(
        name: string,
        new_name: string
    ) {
        try {
            const response = await axios.post(
                `${this.mlflowUrl}/api/2.0/mlflow/registered-models/rename`,
                {
                    name: name,
                    new_name: new_name
                }
            );
            if (response.status !== 200) {
                throw new BadRequestException(`MLflow returned status ${response.status}`);
            }
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

    // Update Model
    async updateModel(
        name: string,
        description: string
    ) {
        try {
            const response = await axios.patch(
                `${this.mlflowUrl}/api/2.0/mlflow/registered-models/update`,
                {
                    name: name,
                    description: description
                }
            );
            if (response.status !== 200) {
                throw new BadRequestException(`MLflow returned status ${response.status}`);
            }
            return response.data;
        } catch (error) {
            if (error.response) {
                throw new HttpException(
                    `MLflow Error: ${error.response.data || 'Unknown error'}`,
                    error.response.status || HttpStatus.INTERNAL_SERVER_ERROR
                );
            }
            throw new HttpException(
                `Failed to connect to MLflow API. Check your mlflowUrl.`,
                HttpStatus.SERVICE_UNAVAILABLE
            );
        }
    }

    // Delete Model
    async deleteModel(name: string) {
        const response = await axios.delete(
            `${this.mlflowUrl}/api/2.0/mlflow/registered-models/delete`,
            { data: { name: name } }
        );
        if (response.status !== 200) {
            throw new BadRequestException(`MLflow returned status ${response.status}`);
        }
        return { message: "Model deleted successfully" };
    }

    // Search Model - Get all Model
    async searchModel(
        filter: string,
        max_results: number,
        order_by: string[],
        page_token: string
    ) {
         try {
            const response = await axios.get(
                `${this.mlflowUrl}/api/2.0/mlflow/registered-models/search`,
                { params: {filter, max_results, order_by, page_token } }
            );
            if (response.status !== 200) {
                throw new BadRequestException(`MLflow returned status ${response.status}`);
            }
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

    // Set Model Tag
    async setModelTag(
        name: string,
        key: string,
        value: string
    ) {
         try {
            const response = await axios.post(
                `${this.mlflowUrl}/api/2.0/mlflow/registered-models/set-tag`,
                {
                    name: name,
                    key: key,
                    value: value
                }
            );
            if (response.status !== 200) {
                throw new BadRequestException(`MLflow returned status ${response.status}`);
            }
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

    // Set Model Tag
    async deleteModelTag(
        name: string,
        key: string
    ) {
         try {
            const response = await axios.delete(
                `${this.mlflowUrl}/api/2.0/mlflow/registered-models/delete-tag`,
                { data: { name: name, key: key } }
            );
            if (response.status !== 200) {
                throw new BadRequestException(`MLflow returned status ${response.status}`);
            }
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

    // Get all Subscribed Model
    async getSubscribedModel(userId: string) {
        return await this.registerModel.find(
            { user_id: new Types.ObjectId(userId)}
        ).select('model_name location').exec();
    }

    //Subscribe Model
    async subscribeModel(userId: string, modelName: string, location: string) {
        return await this.registerModel.findOneAndUpdate(
            { user_id: new Types.ObjectId(userId), model_name: modelName }, // filter criteria
            { location }, // update
            { new: true, upsert: true } // options: return updated doc, create if not exists
        );
    }

    // Un-Subscribe Model
    async unSubscribeModel(userId: string, modelName: string) {
        return await this.registerModel.findOneAndDelete({
            user_id: new Types.ObjectId(userId),
            model_name: modelName
        });
    }

    // Get schedule Plane
    async getSchedulePlan(userId: string, startTime: Date, endTime: Date) {
        const query = {user_id: new Types.ObjectId(userId)};
        // Get all subscribed models
        const models = await this.registerModel.find(query)
            .select("model_name").exec();
        console.log("Get subscribed model: ", models);
        // Get model cron and enable
        let model_schedule = [];
        for (const model of models) {
            const res = await axios.get(
                `${this.mlflowUrl}/api/2.0/mlflow/registered-models/get`,
                { params: { name: model.model_name } }
            );
            const tags = res.data.registered_model.tags;
            let cron_str = null;
            let enable = true; 
            for (const tag of tags){
                if (tag.key == "schedule") cron_str = tag.value;
                if (tag.key == "enable") enable = tag.value == "false"?false: true;
            }
            model_schedule.push({cron_str: cron_str, enable: enable, model_name: model.model_name});
            console.log("Model schedule: ", model_schedule);
        }
        // Gen schedule
        let occurrences = [];
        for (const s of model_schedule) {
            if (!s.enable) continue;
            try {
                let interval = cronParser.parse(s.cron_str, { currentDate: startTime });
                //console.log("Interval: ", interval);
                while (true) {
                    let nextTime = interval.next().toDate();
                    //console.log("Next time: ", nextTime);
                    //console.log("End time: ", endTime);

                    if (nextTime > endTime) break;
                    occurrences.push({ time: nextTime, model_name: s.model_name });
                }
            } catch (err) {
                console.error(`Invalid CRON expression: ${s.cron_str}`, err);
            }
        }
        console.log("occur: ", occurrences);

        return occurrences.sort((a, b) => a.time - b.time);
    }

    /* ----- Model Version ----- */
    // Create Model Vesrion 
    async createVersion(
        name: string,
        source: string,
        tags: { key: string, value: string }[],
        description: string
    ) {
        try {
            const response = await axios.post(
                `${this.mlflowUrl}/api/2.0/mlflow/model-versions/create`,
                {
                    name: name,
                    source: source,
                    tags: tags,
                    description: description
                }
            );
            if (response.status !== 200) {
                throw new BadRequestException(`MLflow returned status ${response.status}`);
            }
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
    async getVersion(
        name: string,
        version: string
    ) {
        try {
            const response = await axios.get(
                `${this.mlflowUrl}/api/2.0/mlflow/model-versions/get`,
                { params: { name: name, version: version } }
            );
            if (response.status !== 200) {
                throw new BadRequestException(`MLflow returned status ${response.status}`);
            }
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
    async updateVersion(
        name: string,
        version: string,
        description: string
    ) {
        try {
            const response = await axios.patch(
                `${this.mlflowUrl}/api/2.0/mlflow/model-versions/update`,
                {
                    name: name,
                    version: version, 
                    description: description
                }
            );
            if (response.status !== 200) {
                throw new BadRequestException(`MLflow returned status ${response.status}`);
            }
            return response.data;
        } catch (error) {
            if (error.response) {
                throw new HttpException(
                    `MLflow Error: ${error.response.data || 'Unknown error'}`,
                    error.response.status || HttpStatus.INTERNAL_SERVER_ERROR
                );
            }
            throw new HttpException(
                `Failed to connect to MLflow API. Check your mlflowUrl.`,
                HttpStatus.SERVICE_UNAVAILABLE
            );
        }
    }

    // Delete Model Version
    async deleteVersion(name: string, version: string) {
        const response = await axios.delete(
            `${this.mlflowUrl}/api/2.0/mlflow/model-versions/delete`,
            { data: { name: name, version: version } }
        );
        if (response.status !== 200) {
            throw new BadRequestException(`MLflow returned status ${response.status}`);
        }
        return { message: "Model deleted successfully" };
    }

    // Get Lattest Model Vesrion 
    async getLastestVersion(
        name: string,
        stages: string[]
    ) {
        try {
            const response = await axios.post(
                `${this.mlflowUrl}/api/2.0/mlflow/registered-models/get-latest-versions`,
                {
                    name: name,
                    stages: stages
                }
            );
            if (response.status !== 200) {
                throw new BadRequestException(`MLflow returned status ${response.status}`);
            }
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

    // Get all Model Version
    async getAllModelVersion(
        filter: string,
        max_results: number,
        order_by: string[],
        page_token: string
    ) {
         try {
            const response = await axios.get(
                `${this.mlflowUrl}/api/2.0/mlflow/model-versions/search`,
                { params: {filter, max_results, order_by, page_token } }
            );
            if (response.status !== 200) {
                throw new BadRequestException(`MLflow returned status ${response.status}`);
            }
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
    async setModelversionTag(
        name: string,
        version: string,
        key: string,
        value: string
    ) {
         try {
            const response = await axios.post(
                `${this.mlflowUrl}/api/2.0/mlflow/model-versions/set-tag`,
                {
                    name: name,
                    version: version,
                    key: key,
                    value: value
                }
            );
            if (response.status !== 200) {
                throw new BadRequestException(`MLflow returned status ${response.status}`);
            }
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
    async deleteModelversionTag(
        name: string,
        version: string,
        key: string
    ) {
         try {
            const response = await axios.delete(
                `${this.mlflowUrl}/api/2.0/mlflow/model-versions/delete-tag`,
                { data: { name: name, version: version ,key: key } }
            );
            if (response.status !== 200) {
                throw new BadRequestException(`MLflow returned status ${response.status}`);
            }
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
    
    /////////////////////////////////////////////////////////////////////////////////////////--- Old things
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

            await this.activitiesService.createActivity("create_model", userId, savedModel._id.toString());

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
    async getAllRegisteredModels(userId: string, query: BaseSearchModelQueryDto) {
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
            console.log("Url when call", this.mlflowUrl)
            const response = await axios.get(
                `${this.mlflowUrl}/api/2.0/mlflow/registered-models/get`,
                { params: { name: unique_name } }
            );
            const model = await this.modelModel.findOne({ name: unique_name }).exec();
            response.data.registered_model['_id'] = model._id;
            response.data.registered_model['alt_name'] = model.name.includes("/") ? model.name.split("/").pop() : model.name;
            return response.data;
        } catch (error) {
            console.log("Lỗi kết nối:", error)
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

    // Get All Model Versions
    async getAllModelVersions(
        userId: string,
        name: string,
        page_token: string
    ) {
        try {
            const unique_name = `${userId}/${name}`;
            //console.log("Page Token: ", page_token);
            //console.log("Filter: ", `name='${unique_name}'`);
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
            let versions = response.data['model_versions'];
            versions = versions.map(version => ({
                ...version,
                alt_name: version.name.includes("/") ? version.name.split("/").pop() : version.name
            }));
            response.data['model_versions'] = versions;

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
        const existingModel = await this.modelModel.findById(model_id).select("schedule enableSchedule").exec();
        if (existingModel == null) {
            throw new NotFoundException(`Model with ID ${model_id} not found`);
        }
        return existingModel;
    }

    async getModelSchedulePlan(userId: string, modelId: string, startTime: Date, endTime: Date) {
        const query = {
            owner_id: new Types.ObjectId(userId),
            enableSchedule: true,
        };
        if (modelId) {
            query["_id"] = new Types.ObjectId(modelId);
        }
        // Get all models of the user
        const models = await this.modelModel.find(query)
            .select("_id name description schedule").exec()
        //console.log("Models: ", models);
        let occurrences = [];
        models.forEach(({ _id, name, description, schedule }) => {
            try {
                let interval = cronParser.parse(schedule, { currentDate: startTime });
                //console.log("Interval: ", interval);
                while (true) {
                    let nextTime = interval.next().toDate();
                    //console.log("Next time: ", nextTime);
                    //console.log("End time: ", endTime);

                    if (nextTime > endTime) break;
                    occurrences.push({ time: nextTime, model_id: _id, name: name, description: description });
                }
            } catch (err) {
                console.error(`Invalid CRON expression: ${schedule}`, err);
            }
        });

        return occurrences.sort((a, b) => a.time - b.time);

    }

    async setModelEnableSchedule(userId: string, model_id: string, enableSchedule: boolean) {
        const existingModel = await this.modelModel.findOne({
            _id: new Types.ObjectId(model_id),
            owner_id: new Types.ObjectId(userId)
        }).exec();
        if (existingModel == null) {
            throw new NotFoundException(`Model with ID ${model_id} not found`);
        }
        existingModel.enableSchedule = enableSchedule;
        try {
            await existingModel.save();
        } catch (error) {
            throw new InternalServerErrorException(`Error while setting model enable schedule: ${model_id}`)
        }
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
