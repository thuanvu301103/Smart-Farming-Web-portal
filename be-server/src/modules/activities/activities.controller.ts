import {
    Controller,
    Body, Req, Param, Query,
    Get, Post,
    UseGuards,
    ForbiddenException, BadRequestException, 
} from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { JwtAuthGuard } from "./../auth/jwt-auth.guard";

@Controller(':userId/activities')
export class ActivitiesController {
    constructor(
        private readonly activitiesService: ActivitiesService
    ) { }

    @Get()
    @UseGuards(JwtAuthGuard)
    // Get activities of a user
    async getActivities(
        @Query('year') year: string,
        @Param('userId') userId,
        @Req() req
    ) {
        if (year && !/^\d+$/.test(year)) {
            throw new BadRequestException('Year must contain only digits');
        }

        const reqUserId = req.user.userId;
        const isOwner = reqUserId == userId;
        //console.log(isOwner);
        return await this.activitiesService.getActivities(isOwner, year, userId)
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    // Create new activity     
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
