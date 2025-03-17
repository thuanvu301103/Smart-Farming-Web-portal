import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ModelsController, ModelScriptsController } from './models.controller';
import { ModelsService } from './models.service';
import { ActivitiesModule } from "../activities/activities.module";
import { Models, ModelSchema } from '../../schemas/models.schema';
import { Script, ScriptSchema } from '../../schemas/scripts.schema';


@Module({
    imports: [
        forwardRef(() => ActivitiesModule),
        MongooseModule.forFeature([
            { name: Models.name, schema: ModelSchema },
            { name: Script.name, schema: ScriptSchema }
        ])
    ],
    controllers: [ModelsController, ModelScriptsController],
    providers: [ModelsService],
    exports: [ModelsService, MongooseModule],
})
export class ModelsModule {}
