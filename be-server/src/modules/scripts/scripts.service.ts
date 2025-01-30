import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Script } from './schemas/script.schema';

@Injectable()
export class ScriptsService {
    constructor(@InjectModel(Script.name) private scriptModel: Model<Script>) { }

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
}