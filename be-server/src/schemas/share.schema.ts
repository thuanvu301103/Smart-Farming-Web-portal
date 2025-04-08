import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Share extends Document {
    @Prop({
        type: Types.ObjectId,
        ref: 'User'
    })
    user_id: Types.ObjectId;

    @Prop({
        type: [{
            type: Types.ObjectId,
            ref: 'Script'
        }]
    })
    script_id: Types.ObjectId[];
}

export const ShareSchema = SchemaFactory.createForClass(Share);