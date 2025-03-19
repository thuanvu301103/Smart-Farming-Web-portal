import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import {
    Notification, NotificationsSchema,
    ShareNotification, ShareNotificationsSchema,
    CommentNotification, CommentNotificationsSchema
} from '../../schemas/notifications.schema';
import { NotificationGateway } from '../../gateway/notify/notify.gateway';

@Module({
    imports: [
        MongooseModule.forFeatureAsync([
            {
                name: Notification.name,
                useFactory: () => {
                    const schema = NotificationsSchema;
                    schema.discriminator('share', ShareNotificationsSchema);
                    schema.discriminator('comment', CommentNotificationsSchema);
                    return schema;
                },
            },
        ]),
    ],
    controllers: [NotificationsController],
    providers: [NotificationsService, NotificationGateway],
    exports: [NotificationsService]
})
export class NotificationsModule {}
