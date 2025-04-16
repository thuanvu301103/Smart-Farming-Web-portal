import { Controller, Post, Get, Delete, Body, Query, Param } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { Notification } from '../../schemas/notifications.schema';
// DTO
import { BaseSearchNotificationQueryDto } from '../../dto/notifications.dto';

@Controller('notification')
export class NotificationsController {

    constructor(private readonly notificationsService: NotificationsService) { }

    @Get(':userId')
    async getNotification(@Param('userId') userId: string, @Query() query: BaseSearchNotificationQueryDto) {
        return this.notificationsService.getNotificationSentTo(userId, query);
    }


    @Post('share')
    async createShare(@Body() data: {
        from: string;
        to: string[];
        script_id: string
    }) {
        return this.notificationsService.createShareNotification(data.from, data.to, data.script_id);
    }

    @Delete(':notificationId')
    async deleteScript(@Param('notificationId') id: string) {
        return await this.notificationsService.deleteNotification(id);
    }
}
