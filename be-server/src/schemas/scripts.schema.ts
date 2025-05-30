import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Model, Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Script extends Document {
    @Prop()
    name: string;

    @Prop({ default: '' })
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

    @Prop({ default: 0 })
    favorite: number;

    @Prop({
        type: {
            avg: { type: Number, default: 0 },
            count: { type: Number, default: 0 }
        },
        default: () => ({ avg: 0, count: 0 })
    })
    rating: {
        avg: number;
        count: number;
    };

    @Prop({type: [String]})
    location: string[];

    @Prop({ type: [String] })
    plant_type: string[];
}

const ScriptSchema = SchemaFactory.createForClass(Script);

// Pre hook middle for deleting a script
ScriptSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
    const script = this as unknown as Document;
    // Delete all related comments
    const commentModel = this.model('Comment');
    await commentModel.deleteMany({ script_id: script._id });
    // Delete all related shares
    const shareModel = this.model('Share');
    await shareModel.deleteMany({ script_id: script._id });
    // Delete all related rates
    const rateModel = this.model('Rate');
    await rateModel.deleteMany({ script_id: script._id });
    next();
});

export { ScriptSchema };
