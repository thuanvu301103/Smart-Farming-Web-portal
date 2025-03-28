import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ModelsController } from './models.controller';
import { ModelScriptsController } from './models.script.controller';
import { ModelsService } from './models.service';
import { ModelScriptsService } from './models.script.service';
import { FilesService } from '../files/files.service';
import { ActivitiesModule } from "../activities/activities.module";
import { Models, ModelSchema } from '../../schemas/models.schema';
import { Script, ScriptSchema } from '../../schemas/scripts.schema';
import { ModelScript, ModelScriptSchema } from '../../schemas/models.scripts.schema';

@Module({
    imports: [
        forwardRef(() => ActivitiesModule),
        MongooseModule.forFeature([
            { name: Models.name, schema: ModelSchema },
            { name: Script.name, schema: ScriptSchema },
            { name: ModelScript.name, schema: ModelScriptSchema }
        ])
    ],
    controllers: [ModelsController, ModelScriptsController],
    providers: [ModelsService, ModelScriptsService, FilesService],
    exports: [ModelsService, ModelScriptsService, MongooseModule],
})
export class ModelsModule {}
