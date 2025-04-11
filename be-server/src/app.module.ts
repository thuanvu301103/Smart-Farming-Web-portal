import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScriptsModule } from './modules/scripts/scripts.module';
import { UsersModule } from './modules/users/users.module';
import { DatabaseModule } from './database/database.module';
import { FilesModule } from './modules/files/files.module';
import { ModelsModule } from './modules/models/models.module';
import { CommentsModule } from './modules/comments/comments.module';
import { NotificationGateway } from './gateway/notify/notify.gateway';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { AuthModule } from './modules/auth/auth.module';
import { ActivitiesModule } from './modules/activities/activities.module';

@Module({
  imports: [
    ConfigModule.forRoot({
        isGlobal: true,
        ignoreEnvFile: process.env.NODE_ENV === 'production',
        envFilePath: '.env',
    }), // Import ConfigModule at the root level
    DatabaseModule,
    ScriptsModule,
    UsersModule,
    FilesModule,
    ModelsModule,
    CommentsModule,
    NotificationsModule,
    NotificationGateway,
    AuthModule,
        ActivitiesModule,
  ],
  controllers: [AppController],
  providers: [AppService, NotificationGateway],
})
export class AppModule {}
