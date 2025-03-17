import {
    Controller,
    Body, Req, Param,
    Post,
    UseGuards,
    ForbiddenException
} from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { JwtAuthGuard } from "./../auth/jwt-auth.guard";

@Controller(':userId/activities')
export class ActivitiesController {
    constructor(
        private readonly activitiesService: ActivitiesService
    ) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    async createActivity(
        @Body() data: { type: string, obj_id: string },
        @Param('userId') userId,
        @Req() req
    ): Promise<{ _id: string }> {

        // Check authorization of request-user
        const currentUserId = req.user.userId;
        if (currentUserId !== userId) {
            throw new ForbiddenException('You can only create your own activity.');
        }

        const newActivityId = await this.activitiesService.createActivity(data.type, userId, data.obj_id );
        return { _id: newActivityId };
    }
}
