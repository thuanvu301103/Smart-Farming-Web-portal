import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScriptsModule } from './modules/scripts/scripts.module';
import { UsersModule } from './modules/users/users.module';
import { DatabaseModule } from './database/database.module';
import { FilesModule } from './modules/files/files.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }), // Import ConfigModule at the root level
        DatabaseModule, ScriptsModule, UsersModule, FilesModule
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
