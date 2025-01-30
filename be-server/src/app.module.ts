import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScriptsModule } from './modules/scripts/scripts.module';
import { UsersModule } from './modules/users/users.module';
import { DatabaseModule } from './database/database.module';

@Module({
    imports: [DatabaseModule, ScriptsModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
