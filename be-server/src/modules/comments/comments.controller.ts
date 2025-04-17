import {
    Controller, Body, Get, Post, Put, Delete,
    Param, Query,
    UseGuards
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { Comment } from '../../schemas/comments.schema';
import { JwtAuthGuard } from "./../auth/jwt-auth.guard";
// DTO
import { BaseSearchCommentQueryDto } from '../../dto/comments.dto';

@Controller(':userId/scripts/:scriptId/comments')
export class CommentsController {
    constructor(private readonly commentsService: CommentsService) { }

    @Get()
    @UseGuards(JwtAuthGuard)
    async findAllComments(
        @Param('scriptId') scriptId: string,
        @Query() query: BaseSearchCommentQueryDto,
    ) {
        //console.log(userId);
        return this.commentsService.findAllComments(scriptId, query);
    }

    @Get(':commentId/history')
    @UseGuards(JwtAuthGuard)
    async getUpdateHistory(@Param('commentId') id: string) {
        const updateHistory = await this.commentsService.getUpdateHistory(id);
        return updateHistory;
    }

    @Get(':commentId/subcomments')
    @UseGuards(JwtAuthGuard)
    async findAllSubComments(@Param('commentId') commentId: string):
        Promise<Comment[]> {
        return this.commentsService.findAllSubComments(commentId);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
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
    @UseGuards(JwtAuthGuard)
    async updateContent(
        @Param('commentId') commentId: string,
        @Body() data: {content: string}
    ) {
        return await this.commentsService.updateContent(commentId, data.content);
    }

    @Delete(':commentId')
    @UseGuards(JwtAuthGuard)
    async deleteComment(@Param('commentId') commentId: string) {
        return await this.commentsService.deleteComment(commentId);
    }
}
