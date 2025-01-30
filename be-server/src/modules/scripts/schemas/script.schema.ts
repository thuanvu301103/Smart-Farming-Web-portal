import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Script extends Document {
    @Prop()
    name: string;

    @Prop()
    description: string;

    @Prop()
    privacy: string;

    @Prop()
    owner_id: Types.ObjectId;
}

export const ScriptSchema = SchemaFactory.createForClass(Script);
