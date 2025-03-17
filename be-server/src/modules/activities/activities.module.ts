import { Module, forwardRef} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ActivitiesController } from './activities.controller';
import { ActivitiesService } from './activities.service';
import { ScriptsService } from "../scripts/scripts.service";
import { ScriptsModule } from "../scripts/scripts.module";
import { ModelsModule } from "../models/models.module";
import { CommentsModule } from "../comments/comments.module";
import { Activity, ActivitySchema } from '../../schemas/activities.schema';
import { Script, ScriptSchema } from '../../schemas/scripts.schema';
import { Models, ModelSchema } from '../../schemas/models.schema';
import { Comment, CommentSchema } from '../../schemas/comments.schema';

@Module({
    imports: [
        forwardRef(() => ModelsModule),
        forwardRef(() => CommentsModule),
        MongooseModule.forFeature([
            { name: Activity.name, schema: ActivitySchema },
            { name: Script.name, schema: ScriptSchema },
            { name: Models.name, schema: ModelSchema },
            { name: Comment.name, schema: CommentSchema },
        ]),
        forwardRef(() => ScriptsModule),
    ],
    controllers: [ActivitiesController],
    providers: [ActivitiesService],
    exports: [ActivitiesService, MongooseModule],
})
export class ActivitiesModule { }

