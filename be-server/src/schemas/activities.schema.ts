import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Activity extends Document {
    @Prop()
    type: string;

    @Prop({
        type: Types.ObjectId,
        ref: 'User'
    })
    user_id: Types.ObjectId;

    @Prop({type: Types.ObjectId})
    obj_id: Types.ObjectId;

    @Prop()
    createdAt: Date;
}

export const ActivitySchema = SchemaFactory.createForClass(Activity);
