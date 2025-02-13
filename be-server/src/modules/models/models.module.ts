import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ModelsController, ModelScriptsController } from './models.controller';
import { ModelsService } from './models.service';
import { Models, ModelSchema } from '../../schemas/models.schema';
import { Script, ScriptSchema } from '../../schemas/scripts.schema';


@Module({
    imports: [MongooseModule.forFeature([
        { name: Models.name, schema: ModelSchema },
        { name: Script.name, schema: ScriptSchema }
    ])],
  controllers: [ModelsController, ModelScriptsController],
  providers: [ModelsService]
})
export class ModelsModule {}
