import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class ModelScript extends Document {
    @Prop()
    version: string;

    @Prop({
        type: Types.ObjectId,
        ref: 'Models'
    })
    model_id: Types.ObjectId;

    @Prop()
    model_version: string;

    @Prop()
    createdAt: Date;
}

export const ModelScriptSchema = SchemaFactory.createForClass(ModelScript);