import {
    Injectable, Inject, forwardRef,
    NotFoundException, BadRequestException,
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

    // Create Registered Model
    async createRegisteredModel(
        userId: string,
        name: string,
        tags: { key: string, value: string }[],
        description: string
    ) {
        const unique_name = `${userId}/${name}`;
        const response = await axios.post(
            `${this.mlflowUrl}/api/2.0/mlflow/registered-models/create`,
            {
                name: unique_name,
                tags: tags,
                description: description
            }
        );
        //console.log(response.status);
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
        //console.log(unique_name);
        const response = await axios.get(
            `${this.mlflowUrl}/api/2.0/mlflow/registered-models/get`,
            { params: { name: unique_name } }
        );
        return response.data;
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
}
