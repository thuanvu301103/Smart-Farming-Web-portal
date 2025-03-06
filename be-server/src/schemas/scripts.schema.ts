import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Comment } from './comments.schema';

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
        type: [Number],
        default: [1.0]
    })
    version: number[];

    @Prop({
        type: Types.ObjectId,
        ref: 'Models',
        default: null
    })
    model_id: Types.ObjectId | null;

    @Prop({
        type: [{
            type: Types.ObjectId,
            ref: 'User'
        }]
    })
    share_id: Types.ObjectId[];

    @Prop({ default: 0 })
    favorite: number;

    @Prop({type: [String]})
    location: string[];

    @Prop({ type: [String] })
    plant_type: string[];
}

export const ScriptSchema = SchemaFactory.createForClass(Script);

// Pre hook middle for deleting a script
ScriptSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
    const script = this as unknown as Document;
    console.log("Deleting script ID: ", script._id);
    // Delete all related comments
    const commentModel = this.model('Comment');
    await commentModel.deleteMany({ script_id: script._id });
    next();
});