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
import { Activity } from '../../schemas/activities.schema';

@Injectable()
export class ActivitiesService {
    constructor(
        @InjectModel(Activity.name) private activityModel: Model<Activity>,
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
}
