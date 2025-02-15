import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Comment extends Document {
    @Prop({ required: true, type: String })
    content: string;

    @Prop({ type: Types.ObjectId, ref: 'Script', required: true })
    script_id: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    owner_id: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Comment', default: null })
    sub_comment_id: Types.ObjectId | null;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

// Register the Comment model with Mongoose
export const CommentModel = mongoose.model('Comment', CommentSchema);
