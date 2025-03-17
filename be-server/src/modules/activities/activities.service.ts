import {
    Injectable,
    forwardRef, Inject,
    NotFoundException, UnauthorizedException
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ScriptsService } from "../scripts/scripts.service";
import { ModelsService } from "../models/models.service";
import { CommentsService } from "../comments/comments.service";
// Schema
import { Activity } from '../../schemas/activities.schema';
import { Script } from '../../schemas/scripts.schema';
import { Models } from '../../schemas/models.schema';
import { Comment } from '../../schemas/comments.schema';

@Injectable()
export class ActivitiesService {
    constructor(
        @InjectModel(Activity.name) private activityModel: Model<Activity>,
        @InjectModel(Script.name) private scriptModel: Model<Script>,
        @InjectModel(Models.name) private modelModel: Model<Models>,
        @InjectModel(Comment.name) private commentModel: Model<Comment>,
        @Inject(forwardRef(() => ModelsService)) private readonly modelsService: ModelsService, // Inject ModelsService
        @Inject(forwardRef(() => CommentsService)) private readonly commentsService: CommentsService, // Inject CommentsService
        @Inject(forwardRef(() => ScriptsService)) private readonly scriptsService: ScriptsService, // Inject ScriptsService
    ) { }

    // Create new activity
    async createActivity(
        type: string,
        user_id: string,
        obj_id: string
    ): Promise<string> {
        // Check whether object is exist or not
        if (type == "create_script") {
            const scriptExists = await this.scriptsService.isExist(obj_id);
            if (!scriptExists) {
                throw new NotFoundException('Cannot find script!');
            }
        }
        else if (type == "create_model") {
            const modelExists = await this.modelsService.isExist(obj_id);
            if (!modelExists) {
                throw new NotFoundException('Cannot find model!');
            }
        }
        else if (type == "create_comment") {
            const commentExists = await this.commentsService.isExist(obj_id);
            if (!commentExists) {
                throw new NotFoundException('Cannot find comment!');
            }
        }
        else throw new NotFoundException('Invalid activity type!');
        // Create new activity
        const newActivity = new this.activityModel({
            type: type,
            user_id: new Types.ObjectId(user_id),
            obj_id: new Types.ObjectId(obj_id)
        });
        return (await newActivity.save())._id.toString();
    }

    async getActivities(
        isOwner: boolean,
        year: string,
        userId: string
    ) {
        const numericYear = Number(year);
        const startDate = new Date(numericYear, 0, 1);
        const endDate = new Date(numericYear + 1, 0, 1);

        //console.log(userId, numericYear, startDate, endDate);

        // Get all Activity of a user
        const allActivities = await this.activityModel.find({
            user_id: new Types.ObjectId(userId),
            createdAt: { $gte: startDate, $lt: endDate },
        }).exec();

        //console.log(allActivities);

        // Filter activities by Moth and type
        const activitiesByMonth = {};
        allActivities.forEach(activity => {
            const createdAt = new Date(activity.createdAt);
            const monthKey = `${createdAt.getFullYear()}-${String(createdAt.getMonth() + 1).padStart(2, '0')}`; // YYYY-MM

            if (!activitiesByMonth[monthKey]) {
                activitiesByMonth[monthKey] = {};
            }

            const type = activity.type;

            if (!activitiesByMonth[monthKey][type]) {
                activitiesByMonth[monthKey][type] = [];
            }

            activitiesByMonth[monthKey][type].push(activity.obj_id);
        });

        //console.log(activitiesByMonth);

        for (const month in activitiesByMonth) {
            for (const type in activitiesByMonth[month]) {
                const objIds = activitiesByMonth[month][type]
                if (type === "create_script") {
                    const query = { _id: { $in: objIds } };
                        if (!isOwner) {
                            query["privacy"] = "public";
                        }

                    const scripts = await this.scriptModel.find(query)
                            .select("_id name")
                            .exec();
                    activitiesByMonth[month][type] = scripts;
                }
                if (!isOwner) continue;
                else {
                    if (type === "create_model") {
                        const models = await this.modelModel.find({ _id: { $in: objIds } })
                            .select("_id name").exec();
                        activitiesByMonth[month][type] = models;
                    }
                    else if (type === "create_comment") {
                        const comments = await this.commentModel.find({ _id: { $in: objIds } })
                            .populate("script_id", "_id name")
                            .select("_id script_id content").exec();
                        activitiesByMonth[month][type] = comments;
                    }
                }

            }
        }


        return activitiesByMonth;
    }
}
