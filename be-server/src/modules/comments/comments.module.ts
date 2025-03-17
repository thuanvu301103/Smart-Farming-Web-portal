import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { ActivitiesModule } from "../activities/activities.module";
import { Comment, CommentSchema } from '../../schemas/comments.schema';

@Module({
    imports: [
        forwardRef(() => ActivitiesModule),
        MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }])
    ],
  controllers: [CommentsController],
    providers: [CommentsService],
    exports: [CommentsService, MongooseModule],
})
export class CommentsModule {}
