import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BadRequestException } from "@nestjs/common";
import { Model, Types, Document} from 'mongoose';
import { User } from '../../schemas/users.schema';
import { Script } from '../../schemas/scripts.schema';
import * as bcrypt from "bcrypt";

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(Script.name) private scriptModel: Model<Script>,
    ){ }

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
        const result = await this.userModel.findOne({ _id: new Types.ObjectId(userId) })
            .select('username links profile_image').lean().exec();
        return result;
    }

    async findOneUser(username: string): Promise<User | null> {
        return this.userModel.findOne({ username });
    }

    async searchUser(partUsername: string, currentUserId: string): Promise<{ username: string; profile_image: string }[]> {
        try {
           
            const users = await this.userModel.find({
                username: new RegExp(partUsername, 'i'),
                _id: { $ne: currentUserId }
            }).select('username profile_image')
                .lean().exec();

            return users;
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

    // Update script
    async updateUserInfo(userId: string, updatedData: Partial<User>) {
        const updatedUser = await this.userModel.findByIdAndUpdate(userId, updatedData, {
            new: true,
            runValidators: true,
        });

        if (!updatedUser) {
            throw new NotFoundException(`Script with ID ${userId} not found`);
        }

        return {
            success: true,
            message: 'User updated successfully',
        };
    }

    // Add/remove favorite script
    async favoriteScript(userId: string, scriptId: string, action: 'add' | 'remove') {
        // Convert scriptId to ObjectId
        const scriptObjectId = new Types.ObjectId(scriptId);

        // Find user by userId
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        // Find script by scriptId
        const script = await this.scriptModel.findById(scriptId);
        if (!script) {
            throw new NotFoundException('Script not found');
        }

        if (action === 'add') {
            // Add scriptId to favorite_scripts array (if not already in)
            if (!user.favorite_scripts.includes(scriptObjectId)) {
                user.favorite_scripts.push(scriptObjectId);
                script.favorite = script.favorite + 1;
            }
        } else if (action === 'remove') {
            // Remove scriptId from favorite_scripts array
            user.favorite_scripts = user.favorite_scripts.filter(id => !id.equals(scriptObjectId));
            script.favorite = script.favorite - 1;
        } else {
            throw new BadRequestException('Invalid action. Use "add" or "remove".');
        }

        // Save changes
        await user.save();
        await script.save();

        return { message: `Script ${action}ed successfully` };
    }
}