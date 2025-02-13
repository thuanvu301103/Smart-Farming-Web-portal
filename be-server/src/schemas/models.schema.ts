import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Models extends Document {
    @Prop()
    name: string;

    @Prop()
    description: string;

    @Prop()
    owner_id: Types.ObjectId;
}

export const ModelSchema = SchemaFactory.createForClass(Models);
