import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class User extends Document {
    @Prop()
    username: string;

    @Prop()
    links: { type: string; link: string }[];

    @Prop()
    profile_image: string;

    @Prop()
    bio: string;

    @Prop()
    password: string;

    @Prop({
        type: [{
            type: Types.ObjectId,
            ref: 'Script'
        }]
    })
    favorite_scripts: Types.ObjectId[]
}

export const UserSchema = SchemaFactory.createForClass(User);
