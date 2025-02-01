import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Script } from './schemas/script.schema';

@Injectable()
export class ScriptsService {
    constructor(@InjectModel(Script.name) private scriptModel: Model<Script>) { }

    // Find all scripts of a user
    async findAllScripts(userId: string):
        Promise<{
            name: string;
            description: string;
            privacy: string
        }[]>
    {
        const result = await this.scriptModel.find({ owner_id: new Types.ObjectId(userId) })
            .select('name description privacy').lean().exec();
        return result;
    }

    // Add new script
    async createScript(
        userId: string,
        name: string,
        description: string,
        privacy: string,
    ):
        Promise<string>
    {
        const newScript = new this.scriptModel({
            name: name,
            description: description,
            privacy: privacy, 
            owner_id: new Types.ObjectId(userId)
        });
        return (await newScript.save())._id.toString();
    }

    // Get script
    async getScript(scriptId: string,):
        Promise<Script>
    {
        const result = await this.scriptModel.findOne({ _id: new Types.ObjectId(scriptId) }).lean().exec();
        return result;
    }

    // Update script
    async updateScriptInfo(scriptId: string, updatedData: Partial<Script>){
        const updatedScript = await this.scriptModel.findByIdAndUpdate(scriptId, updatedData, {
            new: true,
            runValidators: true,
        });

        if (!updatedScript) {
            throw new NotFoundException(`Script with ID ${scriptId} not found`);
        }

        return {
            success: true,
            message: 'Script updated successfully',
        };
    }

    // Delete script
    async deleteScript(scriptId: string) {
        try {
            const result = await this.scriptModel.deleteOne({ _id: new Types.ObjectId(scriptId) }).exec();
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
}