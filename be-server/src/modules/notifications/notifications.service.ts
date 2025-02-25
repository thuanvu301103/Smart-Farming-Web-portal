import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Notification } from '../../schemas/notifications.schema';

@Injectable()
export class NotificationsService {

    constructor(@InjectModel(Notification.name) private notificationModel: Model<Notification>) { }

    // Get notification
    async getNotification(id: string){
        const result = await this.notificationModel.findById(new Types.ObjectId(id)).lean().exec();
        return result;
    }

    // Get notification sent to a user
    async getNotificationSentTo(userId: string) {
        const result = await this.notificationModel
            .find({ to: new Types.ObjectId(userId) })
            .populate('from', 'username')
            .populate('script_id', 'name')
            .lean().exec();
        return result;
    }

    /* Create Notifications */

    // Create share script notifcation 
    async createShareNotification(from: string, to: string, script_id: string) {
        return this.notificationModel.create({
            type: 'share',
            from: new Types.ObjectId(from),
            to: new Types.ObjectId(to),
            script_id: new Types.ObjectId(script_id),
        });
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
