import { Controller, Post, Get, Delete, Body, Query, Param } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { Notification } from '../../schemas/notifications.schema';

@Controller('notification')
export class NotificationsController {

    constructor(private readonly notificationsService: NotificationsService) { }

    @Get()
    async getNotification(@Query('userId') userId: string) {
        return this.notificationsService.getNotificationSentTo(userId);
    }

    /*
    @Get()
    async getNotification(@Query('id') id: string)
    {
        //console.log("Id: ", id);
        return this.notificationsService.getNotification(id);
    }
    */

    @Post('share')
    async createShare(@Body() data: {
        from: string;
        to: string;
        script_id: string
    }) {
        return this.notificationsService.createShareNotification(data.from, data.to, data.script_id);
    }

    @Delete(':notificationId')
    async deleteScript(@Param('notificationId') id: string) {
        return await this.notificationsService.deleteNotification(id);
    }
}
