import {
    Injectable, Inject, forwardRef,
    NotFoundException, UnauthorizedException
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ActivitiesService } from "../activities/activities.service";
// Schema
import { Script } from '../../schemas/scripts.schema';
import { Share } from '../../schemas/share.schema';
import { Rate } from '../../schemas/rate.schema';
import { User } from '../../schemas/users.schema';
// DTO
import { ScriptQueryDto } from '../../dto/scripts.dto';

@Injectable()
export class ScriptsService {
    constructor(
        @InjectModel(Script.name) private scriptModel: Model<Script>,
        @InjectModel(User.name) private readonly userModel: Model<User>,
        @InjectModel(Share.name) private readonly shareModel: Model<Share>,
        @InjectModel(Rate.name) private readonly rateModel: Model<Rate>,
        @Inject(forwardRef(() => ActivitiesService)) private readonly activitiesService: ActivitiesService,
    ) { }

    // Check if script exist or not
    async isExist(scriptId: string): Promise<boolean> {
        if (!Types.ObjectId.isValid(scriptId)) {
            return false; // Unvalid ID
        }
        const script = await this.scriptModel.findById(scriptId).exec();
        return !!script;
    }

    // Check if user has access (be shared) to script or not
    async hasAccess(userId: string, scriptId: string): Promise<boolean> {
        const script = await this.shareModel.find({
            user_id: new Types.ObjectId(userId),
            script_id: new Types.ObjectId(scriptId)
        }).exec();
        //console.log("Has Access: ", script.length != 0);
        return script.length != 0;
    }

    // Get all scripts that shared to a user
    async getSharedScripts(userId: string) {
        const searchRes = await this.shareModel.find({ user_id: new Types.ObjectId(userId) }).select("script_id").exec();
        const scriptIds = searchRes.map(obj => obj.script_id);
        const scripts = await this.scriptModel.find({ _id: { $in: scriptIds } }).exec();
        return scripts;
    }

    // Get all users that been shared a script
    async getSharedUsers(scriptId: string) {
        const searchRes = await this.shareModel.find({ script_id: new Types.ObjectId(scriptId) }).select("user_id").exec();
        const userIds = searchRes.map(obj => obj.user_id);
        return userIds;
    }

    // Get owner of a script
    async getOwner(scriptId: string) {
        const searchRes = await this.scriptModel.findById(scriptId).select("owner_id").exec();
        return searchRes.owner_id;
    }

    // Set Script's share users
    async setSharedUsers(scriptId: string, share_id: string[]) {
        const newSharedIds = share_id.map(id => new Types.ObjectId(id));
        const oldSharedIds = await this.getSharedUsers(scriptId);
        const deleteSharedIds = oldSharedIds.filter(oldId =>
            !newSharedIds.some(newId => newId.equals(oldId))
        );
        const insertSharedIds = newSharedIds.filter(newId =>
            !oldSharedIds.some(oldId => oldId.equals(newId))
        );
        await this.shareModel.deleteMany({ user_id: { $in: deleteSharedIds } });
        await this.shareModel.insertMany(
            insertSharedIds.map(userId => ({ user_id: userId, script_id: new Types.ObjectId(scriptId) }))
        );
    }

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
        // Search Condition
        const filterCondition: any = { owner_id: new Types.ObjectId(userId) };
        //console.log(currentUserId, userId, userId == currentUserId);
        if (currentUserId !== userId) {
            filterCondition.privacy = "public";
        }

        const scripts = await this.scriptModel.find(filterCondition)
            .select('_id name description owner_id privacy favorite location plant_type updatedAt createdAt')
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

    // Search Scripts
    async searchScripts(query: ScriptQueryDto) {
        const {
            page, limit,
            sortBy, order,
            locations,
            plant_types
        } = query;

        //console.log(locations, plant_types);
        const filter: any = {};

        if (locations?.length) {
            filter.location = { $in: locations };
        }

        if (plant_types?.length) {
            filter.plant_type = { $in: plant_types };
        }

        const sortOrder = order === 'asc' ? 1 : -1;
        const skip = (page - 1) * limit;

        const [data, total] = await Promise.all([
            this.scriptModel
                .find(filter)
                .sort({ [sortBy]: sortOrder })
                .skip(skip)
                .limit(limit)
                .exec(),

            this.scriptModel.countDocuments(filter),
        ]);

        return {
            data,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }

    // Get popular and public scripts if a user
    async getTopPublicScripts(userId: string, reqUserId: string) {
        const userObjectId = new Types.ObjectId(userId);
        const user = await this.userModel.findById(reqUserId).exec()
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
                    owner_id: 1,
                    createdAt: 1,
                    updatedAt: 1,
                }
            }
        ]);
        return topScripts.map(script => {
            const scriptId = new Types.ObjectId(script._id as string);

            return {
                ...script,
                isFavorite: user?.favorite_scripts?.some(fav => fav.equals(scriptId)) ?? false
            };
        });
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
        // Create new script
        const newScript = new this.scriptModel({
            name: name,
            description: description,
            privacy: privacy, 
            owner_id: new Types.ObjectId(userId),
        });
        const scriptId = (await newScript.save())._id.toString();
        // Add shared users
        if (share_id.length != 0) {
            await this.setSharedUsers(scriptId, share_id)
        }
        // Create new activity
        await this.activitiesService.createActivity("create_script", userId, scriptId);
        return scriptId;
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
            !await this.hasAccess(reqUserId, scriptId)
        ) {
            throw new UnauthorizedException(`Not allowed to access this script`);
        }

        const sharedUserIds = await this.getSharedUsers(scriptId);
        // Find users related to `share_id`
        const sharedUsers = await this.userModel.find(
            { _id: { $in: sharedUserIds || [] } }, // Handle case where `share_id` is undefined
            "_id username profile_image owner_id createdAt updatedAt"
        ).lean().exec();

        // Check if script is user's favorite or not
        const user = await this.userModel.findById(reqUserId).exec();
        const userFav = user.favorite_scripts;

        // Replace share_id with detailed user info
        return { ...result, share_id: sharedUsers, isFavorite: userFav.includes(new Types.ObjectId(scriptId)) };
    }

    async getScriptv2(scriptId: string) {
        // Find the script by ID
        const result = await this.scriptModel.findOne({ _id: new Types.ObjectId(scriptId) }).lean().exec();

        // Check if script exists
        if (!result) {
            throw new NotFoundException(`Script not found`);
        }

        if (result.privacy === "private") {
            throw new UnauthorizedException(`Not allowed to access this script`);
        }

        return result;
    }

    // Update script
    async updateScriptInfo(reqUserId: string, userId: string, scriptId: string, updatedData) {
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
        if (updatedData.share_id) await this.setSharedUsers(scriptId, updatedData.share_id);
        if (updatedData.owner_id) updatedData.owner_id = new Types.ObjectId(updatedData.owner_id);

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
            console.error('Error deleting script:', error);
            return { success: false, message: 'Error deleting document' };
        }
    }

    /* ========== Rate ========== */

    // Get total rate
    async getScriptRate(scriptId: string) {
        const rate = await this.scriptModel.findById(scriptId).select("rating").exec();
        if (!rate) throw new NotFoundException("Cannot find script");
        return rate;
    }

    // Get rate
    async getRate(userId: string, scriptId: string) {
        const rate = await this.rateModel.find({
            user_id: new Types.ObjectId(userId),
            script_id: new Types.ObjectId(scriptId),
        }).exec();
        if (rate.length === 0) {
            throw new NotFoundException("There is no rate for this script from user");
        }
        return rate;
    }

    // Get rate
    async createRate(userId: string, scriptId: string, rate: number) {
        // If rate exisst then update
        const oldRateObj = await this.rateModel.findOne({
            user_id: new Types.ObjectId(userId),
            script_id: new Types.ObjectId(scriptId),
        }).exec();

        if (oldRateObj) {
            return this.updateRate(userId, scriptId, rate);
        }

        const script = await this.scriptModel.findById(scriptId).exec()
        if (!script) throw new NotFoundException("Script does not exist");
        const rateObj = await this.rateModel.create({
            user_id: new Types.ObjectId(userId),
            script_id: new Types.ObjectId(scriptId),
            rate: rate
        })
        return rateObj;
    }

    // Update Rate
    async updateRate(userId: string, scriptId: string, rate: number) {
        const script = await this.scriptModel.findById(scriptId).exec()
        if (!script) throw new NotFoundException("Script does not exist");
        const oldRateObj = await this.rateModel.findOne({
            user_id: new Types.ObjectId(userId),
            script_id: new Types.ObjectId(scriptId),
        }).select('rate').exec();
        const oldRate = oldRateObj.rate;

        const rateObj = await this.rateModel.findOneAndUpdate({
            user_id: new Types.ObjectId(userId),
            script_id: new Types.ObjectId(scriptId),
        },
            {
                $set: { rate: rate },
            },
            { new: true }).exec();
        const { count, avg } = script.rating;

        const total = avg * count - oldRate + rate;
        const newAvg = total / count;

        await this.scriptModel.findByIdAndUpdate(
            scriptId,
            {
                $set: {
                    'rating.avg': newAvg,
                },
            },
            { new: true }
        ).exec();
        return rateObj;
    }

    // Delete Rate
    async deleteRate(userId: string, scriptId: string) {
        const rateDoc = await this.rateModel.findOne({
            user_id: new Types.ObjectId(userId),
            script_id: new Types.ObjectId(scriptId),
        }).exec();
        if (!rateDoc) throw new NotFoundException("User has not rated this script");
        await rateDoc.deleteOne();
    }
}