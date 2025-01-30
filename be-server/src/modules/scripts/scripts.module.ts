import { Module } from '@nestjs/common';
import { ScriptsController } from './scripts.controller';
import { ScriptsService } from './scripts.service';

@Module({
  controllers: [ScriptsController],
  providers: [ScriptsService]
})
export class ScriptsModule {}
