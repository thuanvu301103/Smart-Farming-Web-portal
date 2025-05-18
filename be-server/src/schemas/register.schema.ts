import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Register extends Document {
    @Prop({
        type: Types.ObjectId,
        ref: 'User'
    })
    user_id: Types.ObjectId;

    @Prop()
    model_name: string;

    @Prop()
    location: string;
}

export const RegisterSchema = SchemaFactory.createForClass(Register);
