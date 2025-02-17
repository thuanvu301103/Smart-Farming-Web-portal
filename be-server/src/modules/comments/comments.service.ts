import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Comment } from '../../schemas/comments.schema';

@Injectable()
export class CommentsService {
    constructor(@InjectModel(Comment.name) private commentModel: Model<Comment>) { }

    // Find all comments of a script
    async findAllComments(scriptId: string):
        Promise<Comment[]> {
        const result = await this.commentModel.find({
            script_id: new Types.ObjectId(scriptId),
            sub_comment_id: { $eq: null }
        }).lean().exec();
        return result;
    }

    // Find all sub-comments of a comment
    async findAllSubComments(commentId: string):
        Promise<Comment[]> {
        const result = await this.commentModel.find({ sub_comment_id: new Types.ObjectId(commentId) }).lean().exec();
        return result;
    }

    // Add new comment
    async createComment(
        content: string,
        scriptId: string,
        ownerId: string,
        sub_comment_id?: string, // Optional paramenter
    ):
        Promise<string> {
        const newComment = new this.commentModel({
            content: content,
            script_id: new Types.ObjectId(scriptId),
            owner_id: new Types.ObjectId(ownerId),
            sub_comment_id: sub_comment_id ? new Types.ObjectId(sub_comment_id) : null
        });
        return (await newComment.save())._id.toString();
    }

    // Update comment
    async updateContent(commentId: string, newContent: string) {
        const updatedComment = await this.commentModel.findByIdAndUpdate(
            commentId,
            { $set: { content: newContent } },
            {
                new: true,
                runValidators: true,
            }
        );

        if (!updatedComment) {
            throw new NotFoundException(`Script with ID ${commentId} not found`);
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
