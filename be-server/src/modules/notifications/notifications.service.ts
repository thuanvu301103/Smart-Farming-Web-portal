import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Notification } from '../../schemas/notifications.schema';
import { NotificationGateway } from '../../gateway/notify/notify.gateway';
// DTO
import { BaseSearchNotificationQueryDto } from '../../dto/notifications.dto';

@Injectable()
export class NotificationsService {

    constructor(
        @InjectModel(Notification.name) private notificationModel: Model<Notification>,
        private notificationGateway: NotificationGateway,
    ) { }

    // Get notification
    async getNotification(id: string){
        const result = await this.notificationModel.findById(id)
            .populate('from', 'username profile_image')
            .populate('script_id', 'name')
            .lean().exec();
        return result;
    }

    // Get notification sent to a user
    async getNotificationSentTo(userId: string, query: BaseSearchNotificationQueryDto) {
        try {
            const {
                page, limit,
                sortBy, order,
                notifyId,
            } = query;

            if (notifyId) return await this.notificationModel.findById(notifyId)
                .populate('from', 'username profile_image')
                .populate('script_id', 'name')
                .lean().exec();

            const filterCondition: any = {};
            filterCondition.to = new Types.ObjectId(userId);
            const sortOrder = order === 'asc' ? 1 : -1;
            const skip = (page - 1) * limit;
            const scripts = await this.notificationModel.find(filterCondition)
                .sort({ [sortBy]: sortOrder })
                .skip(skip)
                .limit(limit)
                .populate('from', 'username profile_image')
                .populate('script_id', 'name')
                .lean().exec();

            const total = await this.notificationModel.countDocuments(filterCondition);
            return {
                data: scripts,
                total,
                page,
                totalPages: Math.ceil(total / limit),
            };

        } catch (error) {
            console.error('Error fetching notification:', error);
            return [];
        }
        /*
        const result = await this.notificationModel
            .find({ to: new Types.ObjectId(userId) })
            .populate('from', 'username profile_image')
            .populate('script_id', 'name')
            .lean().exec();
        return result;
        */
    }

    /* Create Notifications */

    // Create share script notifcation 
    async createShareNotification(from: string, to: string[], script_id: string) {
        const createdNotifications = [];

        for (const userId of to) {
            const newObj = await this.notificationModel.create({
                type: 'share',
                from: new Types.ObjectId(from),
                to: new Types.ObjectId(userId),
                script_id: new Types.ObjectId(script_id),
            });

            const newId = newObj._id;
            createdNotifications.push(newId);

            this.notificationGateway.sendToClient(userId, { id: newId });
        }

        return createdNotifications;
    }

    // Delete a notification
    async deleteNotification(id: string) {
        try {
            const notification = await this.notificationModel.findById(id);
            if (notification) {
                await notification.deleteOne();
            }
        } catch (error) {
            console.error('Error deleting notification:', error);
            return { success: false, message: 'Error deleting document' };
        }
    }

}
