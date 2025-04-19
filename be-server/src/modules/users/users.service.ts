import {
    Injectable, Inject, forwardRef,
    NotFoundException
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BadRequestException } from "@nestjs/common";
import { Model, Types, Document} from 'mongoose';
import { User } from '../../schemas/users.schema';
import { Script } from '../../schemas/scripts.schema';
import { ScriptsService } from "../scripts/scripts.service";
import * as bcrypt from "bcrypt";
// DTO
import { SearchUserByIdQueryDto, SearchUserByNameQueryDto } from '../../dto/users.dto';
import { BaseSearchScriptQueryDto } from '../../dto/scripts.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(Script.name) private scriptModel: Model<Script>,
        @Inject(forwardRef(() => ScriptsService)) private readonly scriptsService: ScriptsService
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

    async getAllUsers(query: SearchUserByIdQueryDto) {

        const {
            page, limit,
            sortBy, order,
            ids,
        } = query;

        const filterCondition: any = {};
        if (ids?.length) {
            filterCondition._id = { $in: await ids.map(id => new Types.ObjectId(id)) };
        }

        const sortOrder = order === 'asc' ? 1 : -1;
        const skip = (page - 1) * limit;
        const users = await this.userModel.find(filterCondition)
            .select('_id username profile_image')
            .sort({ [sortBy]: sortOrder })
            .skip(skip)
            .limit(limit).lean()
            .exec();

        const total = await this.userModel.countDocuments(filterCondition);
        return {
            data: users,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
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
            .select('username bio links profile_image').lean().exec();
        return result;
    }

    async findOneUser(username: string): Promise<User | null> {
        return this.userModel.findOne({ username });
    }

    async searchUser(query: SearchUserByNameQueryDto, currentUserId: string) {
        try {
            const {
                page, limit,
                sortBy, order,
                username,
            } = query;

            const filterCondition: any = {};
            filterCondition.username = new RegExp(username, 'i');
            filterCondition._id = { $ne: currentUserId };

            const sortOrder = order === 'asc' ? 1 : -1;
            const skip = (page - 1) * limit;
            const users = await this.userModel.find(filterCondition)
                .select('_id username profile_image')
                .sort({ [sortBy]: sortOrder })
                .skip(skip)
                .limit(limit).lean()
                .exec();

            const total = await this.userModel.countDocuments(filterCondition);
            return {
                data: users,
                total,
                page,
                totalPages: Math.ceil(total / limit),
            };
           
        } catch (error) {
            console.error('Error searching users:', error);
            return [];
        }
    }

    // Get user's favorite script
    async getFavoriteScript(userId: string, query: BaseSearchScriptQueryDto) {
        try {
            const {
                page, limit,
                sortBy, order,
                locations, plant_types,
                privacy
            } = query;

            // Get user's favorite scripts ids
            const user = await this.userModel.findById(userId).select('favorite_scripts').lean();

            const filterCondition: any = {};
            filterCondition._id = { $in: await user.favorite_scripts.map(id => new Types.ObjectId(id)) }
            if (locations?.length) {
                filterCondition.location = { $in: locations };
            }

            if (plant_types?.length) {
                filterCondition.plant_type = { $in: plant_types };
            }

            if (privacy) filterCondition.privacy = privacy;
            const sortOrder = order === 'asc' ? 1 : -1;
            const skip = (page - 1) * limit;
            const scripts = await this.scriptModel.find(filterCondition)
                .sort({ [sortBy]: sortOrder })
                .skip(skip)
                .limit(limit).lean()
                .exec();

            const total = await this.scriptModel.countDocuments(filterCondition);
            return {
                data: scripts.map(script => ({ ...script, isFavorite: true })),
                total,
                page,
                totalPages: Math.ceil(total / limit),
            };

        } catch (error) {
            console.error('Error fetching scripts:', error);
            return [];
        }
    }

    // Get user's shared scripts
    async getSharedScripts(userId: string, query: BaseSearchScriptQueryDto) {

        const res = await this.scriptsService.getSharedScripts(userId, query);
        const user = await this.userModel.findById(new Types.ObjectId(userId)).exec();
        res['data'] = res['data'].map(script => {
            const scriptId = new Types.ObjectId(script._id);

            return {
                ...script,
                isFavorite: user?.favorite_scripts?.some(fav => fav.equals(scriptId)) ?? false
            };
        });

        return res;
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