import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) { }

    async getInfoUser(userId: string): Promise<{
        username: string;
        links: {
            type: string;
            link: string
        }[]
    }>
    {
        const result = await this.userModel.findOne({ _id: new Types.ObjectId(userId) }).lean().exec();
        return result;
    }
}