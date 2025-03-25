import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Models extends Document {
    @Prop()
    name: string;

    @Prop({
        type: Types.ObjectId,
        ref: 'User'
    })
    owner_id: Types.ObjectId;

    @Prop()
    creation_timestamp: number;

    @Prop()
    last_updated_timestamp: number;

    @Prop()
    description: string;
}

export const ModelSchema = SchemaFactory.createForClass(Models);
