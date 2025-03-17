import {
    Injectable, Inject, forwardRef,
    NotFoundException
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Models } from '../../schemas/models.schema';
import { Script } from '../../schemas/scripts.schema';
import { ActivitiesService } from "../activities/activities.service";

@Injectable()
export class ModelsService {
    constructor(
        @InjectModel(Models.name) private modelModel: Model<Models>,
        @InjectModel(Script.name) private scriptModel: Model<Script>,
        @Inject(forwardRef(() => ActivitiesService)) private readonly activitiesService: ActivitiesService,
    ) { }

    // Check if model exist or not
    async isExist(modelId: string): Promise<boolean> {
        if (!Types.ObjectId.isValid(modelId)) {
            return false; // Unvalid ID
        }
        const model = await this.modelModel.findById(modelId).exec();
        return !!model;
    }

    // Find all models of a user
    async findAllModels(userId: string):
        Promise<{
            name: string;
            description: string;
        }[]> {
        const result = await this.modelModel.find({ owner_id: new Types.ObjectId(userId) })
            .select('name description').lean().exec();
        return result;
    }

    // Add new model
    async addModel(
        userId: string,
        name: string,
        description: string,
    ):
        Promise<string> {
        // Create new Model
        const newModel = new this.modelModel({
            name: name,
            description: description,
            owner_id: new Types.ObjectId(userId)
        });
        const modelId = (await newModel.save())._id.toString();
        // Create new Activity
        await this.activitiesService.createActivity("create_model", userId, modelId);
        return modelId;
    }

    // Get model
    async getModel(modelId: string,):
        Promise<Models> {
        const result = await this.modelModel.findOne({ _id: new Types.ObjectId(modelId) }).lean().exec();
        return result;
    }

    // Update model info
    async updateModelInfo(modelId: string, updatedData: Partial<Models>) {
        const updatedModel = await this.modelModel.findByIdAndUpdate(modelId, updatedData, {
            new: true,
            runValidators: true,
        });

        if (!updatedModel) {
            throw new NotFoundException(`Model with ID ${modelId} not found`);
        }

        return {
            success: true,
            message: 'Model updated successfully',
        };
    }

    // Delete model
    async deleteModel(modelId: string) {
        try {
            const result = await this.modelModel.deleteOne({ _id: new Types.ObjectId(modelId) }).exec();
            if (result.deletedCount === 1) {
                return { success: true, message: 'Document deleted successfully' };
            } else {
                return { success: false, message: 'No document found with the given ID' };
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            return { success: false, message: 'Error deleting document' };
        }
    }

    // Get all scripts of a model
    async findAllScripts(modelId: string):
        Promise<{
            name: string;
            description: string;
            privacy: string;
        }[]> {
        const result = await this.scriptModel.find({ model_id: new Types.ObjectId(modelId) })
            .select('name description privacy').lean().exec();
        return result;
    }

    // add new script
    async addScript(
        name: string,
        description: string,
        privacy: string,
        userId: string,
        modelId: string
    ):
        Promise<string> {
        const newScript = new this.scriptModel({
            name: name,
            description: description,
            privacy: privacy,
            owner_id: new Types.ObjectId(userId),
            model_id: new Types.ObjectId(modelId)
        });
        return (await newScript.save())._id.toString();
    }
}
