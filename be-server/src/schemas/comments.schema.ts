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

    @Prop({
        type: [
            {
                updatedAt: { type: Date, default: Date.now },
                changes: [String],
            },
        ],
        default: [],
    })
    updateHistory: Array<{
        updatedAt: Date;
        changes: string;
    }>;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

CommentSchema.pre('save', function (next) {
    if (this.isModified()) {
        {
            this.updateHistory = this.updateHistory || [];
            const changesAsString = typeof this.content === 'string' ? this.content : JSON.stringify(this.content);
            this.updateHistory.push({
                updatedAt: new Date(),
                changes: changesAsString,
            });
        }
    }
    next();
});

// Register the Comment model with Mongoose
export const CommentModel = mongoose.model('Comment', CommentSchema);
