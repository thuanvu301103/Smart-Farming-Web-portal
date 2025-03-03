import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScriptsController } from './scripts.controller';
import { ScriptsService } from './scripts.service';
import { UsersModule } from "../users/users.module";
import { Script, ScriptSchema } from '../../schemas/scripts.schema';

@Module({
    imports: [
        UsersModule,
        MongooseModule.forFeature([{ name: Script.name, schema: ScriptSchema }])
    ],
    providers: [ScriptsService],
    controllers: [ScriptsController],
    exports: [ScriptsService, MongooseModule], // Export UsersService so that other modules canussr this service
})
export class ScriptsModule { }
