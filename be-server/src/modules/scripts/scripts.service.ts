import { Injectable, NotFoundException } from '@nestjs/common';
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

        return scripts.map(script => ({
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