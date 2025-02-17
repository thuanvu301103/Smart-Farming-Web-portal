import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from '../../schemas/users.schema';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) { }

    async getAllUsers(userIds: string[]): Promise<{
        _id: string;
        username: string
    }[]> {
        // Convert string userIds to MongoDB ObjectId
        console.log("user Ids: ", userIds);
        const objectIds = userIds.map(id => new Types.ObjectId(id));
        // Find users whose _id matches any of the provided ObjectIds
        const result = await this.userModel.find({ _id: { $in: objectIds } }).lean().exec();

        // Return the array of users with _id and username
        return result.map(user => ({
            _id: user._id.toString(),
            username: user.username,
        }));
    }

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