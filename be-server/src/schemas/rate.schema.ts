import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Rate extends Document {
    @Prop({
        type: Types.ObjectId,
        ref: 'User'
    })
    user_id: Types.ObjectId;

    @Prop({
        type: Types.ObjectId,
        ref: 'Script'
    })
    script_id: Types.ObjectId;

    @Prop()
    rate: number;
}

const RateSchema = SchemaFactory.createForClass(Rate);

// Pre hook middle for creating a rate
RateSchema.pre('save', { document: true, query: false }, async function (next) {
    const rateDoc = this as any;
    const scriptId = rateDoc.script_id;
    const newValue = rateDoc.rate;

    const ScriptModel = this.model('Script');
    const script = await ScriptModel.findById(scriptId).select('rating').exec();

    if (script) {
        const { avg, count } = script["rating"];

        const newCount = count + 1;
        const newAvg = ((avg * count) + newValue) / newCount;

        await ScriptModel.findByIdAndUpdate(scriptId, {
            $set: {
                'rating.avg': newAvg,
                'rating.count': newCount
            }
        });
    }

    next();
});

RateSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
    const rateDoc = this as any;
    const scriptId = rateDoc.script_id;
    const oldValue = rateDoc.rate;

    const ScriptModel = this.model('Script');
    const script = await ScriptModel.findById(scriptId).select('rating').exec();

    if (script) {
        const { avg, count } = script["rating"];
        console.log(avg, count);
        const newCount = count - 1;
        let newAvg = 0;
        if (newCount != 0) newAvg = ((avg * count) - oldValue) / newCount;
        console.log(newCount, newAvg);
        await ScriptModel.findByIdAndUpdate(scriptId, {
            $set: {
                'rating.avg': newAvg,
                'rating.count': newCount
            }
        });
    }

    next();
});


export { RateSchema };
