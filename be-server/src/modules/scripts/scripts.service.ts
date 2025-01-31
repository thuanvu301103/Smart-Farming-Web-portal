import { Injectable } from '@nestjs/common';
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
}