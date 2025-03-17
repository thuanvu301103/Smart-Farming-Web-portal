import {
    Injectable, Inject, forwardRef,
    NotFoundException
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Comment } from '../../schemas/comments.schema';
import { ActivitiesService } from "../activities/activities.service";

@Injectable()
export class CommentsService {
    constructor(
        @Inject(forwardRef(() => ActivitiesService)) private readonly activitiesService: ActivitiesService,
        @InjectModel(Comment.name) private commentModel: Model<Comment>
    ) { }

    // Check if comment exist or not
    async isExist(commentId: string): Promise<boolean> {
        if (!Types.ObjectId.isValid(commentId)) {
            return false; // Unvalid ID
        }
        const comment = await this.commentModel.findById(commentId).exec();
        return !!comment;
    }

    // Find all comments of a script
    async findAllComments(scriptId: string):
        Promise<Comment[]> {
        const result = await this.commentModel.find({
            script_id: new Types.ObjectId(scriptId),
            sub_comment_id: { $eq: null }
        })
            .populate('owner_id', 'username profile_image')
            .lean().exec();
        return result;
    }

    // Find all sub-comments of a comment
    async findAllSubComments(commentId: string):
        Promise<Comment[]> {
        const result = await this.commentModel.find({ sub_comment_id: new Types.ObjectId(commentId) })
            .populate('owner_id', 'username profile_image')
            .lean().exec();
        return result;
    }

    async getUpdateHistory(id: string): Promise<any> {
        const comment = await this.commentModel.findById(id, 'updateHistory').exec();
        return comment ? comment.updateHistory : null;
    }

    // Add new comment
    async createComment(
        content: string,
        scriptId: string,
        ownerId: string,
        sub_comment_id?: string, // Optional paramenter
    ):
        Promise<string> {
        // Create new Comment
        const newComment = new this.commentModel({
            content: content,
            script_id: new Types.ObjectId(scriptId),
            owner_id: new Types.ObjectId(ownerId),
            sub_comment_id: sub_comment_id ? new Types.ObjectId(sub_comment_id) : null
        });
        const commentId = (await newComment.save())._id.toString();
        // Create new Activity
        await this.activitiesService.createActivity("create_comment", ownerId, commentId);
        return commentId;
    }

    // Update comment
    async updateContent(id: string, updateData: string) {
        const comment = await this.commentModel.findById(id).exec();

        if (comment) {
            comment.content = updateData;
            /*
            comment.updateHistory = comment.updateHistory || [];
            comment.updateHistory.push({
                updatedAt: new Date(),
                changes: updateData,
            });
            */

            //Object.assign(comment, updateData);
            comment.save();
        } else {
            throw new NotFoundException(`Script with ID ${id} not found`);
        }

        return {
            success: true,
            message: 'Comment updated successfully',
        };
    }



    // Delete script
    async deleteComment(commentId: string) {
        try {
            // Delete the comment
            let result = await this.commentModel.deleteOne({ _id: new Types.ObjectId(commentId) }).exec();
            if (result.deletedCount != 1) {
                return { success: false, message: 'No document found with the given ID' };
            }
            // Delete sub-comments
            result = await this.commentModel.deleteMany({ sub_comment_id: new Types.ObjectId(commentId) }).exec();
            return { success: true, message: 'Document and related documents deleted successfully' };
        } catch (error) {
            console.error('Error deleting user:', error);
            return { success: false, message: 'Error deleting document' };
        }
    }

}
