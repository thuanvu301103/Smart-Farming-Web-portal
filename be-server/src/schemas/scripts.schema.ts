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

    @Prop({
        type: Types.ObjectId,
        ref: 'User'
    })
    owner_id: Types.ObjectId;

    @Prop({
        type: Types.ObjectId,
        ref: 'Models',
        default: null
    })
    model_id: Types.ObjectId | null;
}

export const ScriptSchema = SchemaFactory.createForClass(Script);
