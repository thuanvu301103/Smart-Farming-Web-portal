import { Controller, Body, Get, Post, Put, Delete, Param } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { Comment } from '../../schemas/comments.schema';

@Controller(':userId/scripts/:scriptId/comments')
export class CommentsController {
    constructor(private readonly commentsService: CommentsService) { }

    @Get()
    async findAllComments(@Param('scriptId') scriptId: string):
        Promise<Comment[]> {
        //console.log(userId);
        return this.commentsService.findAllComments(scriptId);
    }

    @Get(':commentId/history')
    async getUpdateHistory(@Param('commentId') id: string) {
        const updateHistory = await this.commentsService.getUpdateHistory(id);
        return updateHistory;
    }

    @Get(':commentId/subcomments')
    async findAllSubComments(@Param('commentId') commentId: string):
        Promise<Comment[]> {
        return this.commentsService.findAllSubComments(commentId);
    }

    @Post()
    async createComment(
        @Body() data: {
            content: string;
            ownerId: string;
            subCommentId: string
        },
        @Param('scriptId') scriptId: string
    ):
        Promise<{ _id: string }> {
        const newCommentId = await this.commentsService.createComment(
            data.content,
            scriptId,
            data.ownerId,
            data.subCommentId,
        );
        return { _id: newCommentId };
    }

    @Put(':commentId')
    async updateContent(
        @Param('commentId') commentId: string,
        @Body() data: {content: string}
    ) {
        return await this.commentsService.updateContent(commentId, data.content);
    }

    @Delete(':commentId')
    async deleteComment(@Param('commentId') commentId: string) {
        return await this.commentsService.deleteComment(commentId);
    }
}
