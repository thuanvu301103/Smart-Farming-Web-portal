import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BadRequestException } from "@nestjs/common";
import { Model, Types, Document} from 'mongoose';
import { User } from '../../schemas/users.schema';
import * as bcrypt from "bcrypt";

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) { }

    async createUser(
        username: string,
        links: {
            type: string;
            link: string
        }[] = [],
        profile_image: string = null,
        password: string): Promise<{ message: string; userId: string }>
    {
        const existingUser = await this.userModel.findOne({ username }).exec();
        if (existingUser) {
            throw new BadRequestException("Username already exists");
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new this.userModel({ username, links, profile_image, password: hashedPassword });
        const savedUser = await user.save();

        return {
            message: "User created successfully",
            userId: savedUser._id.toString(),
        };
    }

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
        }[];
        profile_image: string
    }> {
        const result = await this.userModel.findOne({ _id: new Types.ObjectId(userId) }).lean().exec();
        return result;
    }

    async findOneUser(username: string): Promise<User | null> {
        return this.userModel.findOne({ username });
    }

    async searchUser(partUsername: string): Promise<{
        _id: string
        username: string
    }[]>
    {
        try {
            // Using regex to find users whose usernames contain the partUsername
            const users = await this.userModel.find({ username: new RegExp(partUsername, 'i') });
            return users.map(user => ({ _id: user._id.toString(), username: user.username }));
        } catch (error) {
            console.error('Error searching users:', error);
            return [];
        }
    }

    async validateUser(username: string, password: string): Promise<User | null> {
        const user = await this.findOneUser(username);
        //console.log(user);
        if (user && (await bcrypt.compare(password, user.password))) {
            return user;
        }
        return null;
    }
}