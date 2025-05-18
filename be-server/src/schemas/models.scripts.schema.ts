import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class ModelScript extends Document {
    @Prop()
    model_name: string;
    
    @Prop()
    model_version: string;

    @Prop()
    location: string;

    @Prop()
    avg_temp: number;

    @Prop()
    avg_humid: number;

    @Prop()
    avg_rainfall: number;

    @Prop({
        type: Types.ObjectId,
        ref: 'User'
    })
    owner_id: Types.ObjectId;

    
    @Prop()
    createdAt: Date;
}

export const ModelScriptSchema = SchemaFactory.createForClass(ModelScript);
