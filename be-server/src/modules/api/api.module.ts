import { Module } from '@nestjs/common';
// Modules
import { AuthModule } from '../auth/auth.module';
import { ScriptsModule } from '../scripts/scripts.module';
import { FilesModule } from '../files/files.module';
// Controllers
import { ApiAuthController, ApiScriptsController } from './api.controller';
// Services
import { ApiService } from './api.service';

@Module({
    imports: [AuthModule, ScriptsModule, FilesModule],
    controllers: [ApiAuthController, ApiScriptsController],
    providers: [ApiService]
})
export class ApiModule {}
