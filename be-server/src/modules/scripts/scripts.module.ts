import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScriptsController } from './scripts.controller';
import { ScriptsService } from './scripts.service';
import { UsersModule } from "../users/users.module";
import { ActivitiesModule } from "../activities/activities.module";
import { Script, ScriptSchema } from '../../schemas/scripts.schema';
import { Share, ShareSchema } from '../../schemas/share.schema';

@Module({
    imports: [
        forwardRef(() => ActivitiesModule), // Xử lý vòng lặp phụ thuộc
        forwardRef(() => UsersModule),
        MongooseModule.forFeature([
            { name: Script.name, schema: ScriptSchema },
            { name: Share.name, schema: ShareSchema }
        ]),
    ],
    providers: [ScriptsService],
    controllers: [ScriptsController],
    exports: [ScriptsService], // Export ScriptsService để các module khác có thể sử dụng
})
export class ScriptsModule { }
