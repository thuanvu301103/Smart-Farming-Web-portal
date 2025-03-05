import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UsersService } from "../users/users.service";
import { Script } from '../../schemas/scripts.schema';
import { User } from '../../schemas/users.schema';

@Injectable()
export class ScriptsService {
    constructor(
        @InjectModel(Script.name) private scriptModel: Model<Script>,
        @InjectModel(User.name) private readonly userModel: Model<User>,
    ) { }

    // Find all scripts of a user
    async findAllScripts(userId: string, currentUserId: string):
        Promise<{
            name: string;
            description: string;
            privacy: string;
            favorite: number;
            location: string[];
            plant_type: string[];
            isFavorite: boolean
        }[]>
    {
        // Get favorite_scripts of currentUser
        const user = await this.userModel.findById(currentUserId).select('favorite_scripts').lean();
        const favoriteScripts = user?.favorite_scripts || [];
        //console.log('Favourite scripts: ', currentUserId, favoriteScripts)

        // Search Condition
        const filterCondition: any = { owner_id: new Types.ObjectId(userId) };
        //console.log(currentUserId, userId, userId == currentUserId);
        if (currentUserId !== userId) {
            filterCondition.privacy = "public";
        }

        const scripts = await this.scriptModel.find(filterCondition)
            .select('_id name description privacy favorite location plant_type')
            .lean()
            .exec();

        return scripts.reverse().map(script => ({
            ...script,
            isFavorite: favoriteScripts.some(fav => fav.toString() === script._id.toString())
        }));
    }

    // Find all script with locations
    async findScriptsByLocations(locations: string[]):
        Promise<{
            name: string;
            description: string;
            privacy: string
        }[]> {
        const result = this.scriptModel.find({ location: { $in: locations } })
            .select('name description privacy').lean().exec();
        return result;
    }

    // Get popular and public scripts if a user
    async getTopPublicScripts(userId: string) {
        const userObjectId = new Types.ObjectId(userId);

        const topScripts = await this.scriptModel.aggregate([
            {
                $match: {
                    privacy: "public",
                    owner_id: userObjectId
                }
            }, // Chỉ lấy các script của user và có privacy là "public"
            { $sort: { like: -1 } }, // Sắp xếp theo số lượt like giảm dần
            { $limit: 6 }, // Lấy tối đa 6 tài liệu
            {
                $project: {
                    name: 1,
                    description: 1,
                }
            }
        ]);
        return topScripts;
    }

    // Add new script
    async createScript(
        userId: string,
        name: string,
        description: string,
        privacy: string,
        share_id: string[]
    ):
        Promise<string>
    {
        const newScript = new this.scriptModel({
            name: name,
            description: description,
            privacy: privacy, 
            owner_id: new Types.ObjectId(userId),
            share_id: share_id.map(id => new Types.ObjectId(id))
        });
        return (await newScript.save())._id.toString();
    }

    // Get script
    async getScript(reqUserId: string, userId: string, scriptId: string): Promise<any> {
        // Find the script by ID
        const result = await this.scriptModel.findOne({ _id: new Types.ObjectId(scriptId) }).lean().exec();

        // Check if script exists
        if (!result) {
            throw new NotFoundException(`Script not found`);
        }

        // Check if the script belongs to the user
        if (result.owner_id.toString() !== userId) {
            throw new NotFoundException(`Cannot find script in user's repository`);
        }

        // Check if the user has permission to access it
        if (
            result.owner_id.toString() !== reqUserId &&
            result.privacy === "private" &&
            (!result.share_id || !result.share_id.some((objId: Types.ObjectId) => objId.equals(new Types.ObjectId(reqUserId))))
        ) {
            throw new UnauthorizedException(`Not allowed to access this script`);
        }

        // Find users related to `share_id`
        const sharedUsers = await this.userModel.find(
            { _id: { $in: result.share_id || [] } }, // Handle case where `share_id` is undefined
            "_id username profile_image"
        ).lean().exec();

        // Replace share_id with detailed user info
        return { ...result, share_id: sharedUsers };
    }

    // Update script
    async updateScriptInfo(reqUserId: string, userId: string, scriptId: string, updatedData: Partial<Script>) {
        // Find the script by ID
        const result = await this.scriptModel.findOne({ _id: new Types.ObjectId(scriptId) }).lean().exec();

        // Check if script exists
        if (!result) {
            throw new NotFoundException(`Script not found`);
        }

        // Check if the script belongs to the user
        if (result.owner_id.toString() !== userId) {
            throw new NotFoundException(`Cannot find script in user's repository`);
        }

        // Check if the user has permission to access it
        if (result.owner_id.toString() !== reqUserId) {
            throw new UnauthorizedException(`Not allowed to change this script`);
        }

        updatedData.share_id = updatedData.share_id.map(id => new Types.ObjectId(id));
        updatedData.owner_id = new Types.ObjectId(updatedData.owner_id);

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
            const script = await this.scriptModel.findById(scriptId);
            if (script) {
                await script.deleteOne();
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            return { success: false, message: 'Error deleting document' };
        }
    }
}