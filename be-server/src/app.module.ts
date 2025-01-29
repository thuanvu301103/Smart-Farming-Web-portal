import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScriptsModule } from './scripts/scripts.module';

@Module({
  imports: [ScriptsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
