import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as mongoose from 'mongoose';

@Schema({ timestamps: true, discriminatorKey: 'type' })
export class Notification extends Document {
}

export const NotificationsSchema = SchemaFactory.createForClass(Notification);

@Schema()
export class ShareNotification extends Notification {

    @Prop({
        type: Types.ObjectId,
        ref: 'User',
        required: true
    })
    from: Types.ObjectId;

    @Prop({
        type: Types.ObjectId,
        ref: 'User',
        required: true
    })
    to: Types.ObjectId;

    @Prop({
        type: Types.ObjectId,
        ref: 'Script',
        required: true
    })
    script_id: Types.ObjectId;
}

export const ShareNotificationsSchema = SchemaFactory.createForClass(ShareNotification);


@Schema()
export class CommentNotification extends Notification {

    @Prop({
        type: Types.ObjectId,
        ref: 'User',
        required: true
    })
    from: Types.ObjectId;

    @Prop({
        type: Types.ObjectId,
        ref: 'User',
        required: true
    })
    to: Types.ObjectId;

    @Prop({
        type: Types.ObjectId,
        ref: 'Comment',
        required: true
    })
    comment_id: Types.ObjectId;
}

export const CommentNotificationsSchema = SchemaFactory.createForClass(CommentNotification);

