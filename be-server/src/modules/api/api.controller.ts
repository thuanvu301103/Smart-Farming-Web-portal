import {
    Controller,
    Post, Get,
    Body, Query, Param, Res,
    BadRequestException,
} from '@nestjs/common';
import { Model, Types } from 'mongoose';
// DTO
import { ScriptQueryDto, ScriptFileQueryDto } from '../../dto/scripts.dto';
// Services
import { AuthService } from '../auth/auth.service';
import { ScriptsService } from '../scripts/scripts.service';
import { FilesService } from '../files/files.service';


@Controller('api/auth')
class ApiAuthController {
    constructor(private authService: AuthService) { }

    @Post("login")
    async login(@Body() body: { username: string; password: string }) {
        const user = await this.authService.validateUser(body.username, body.password);
        return this.authService.login(user);
    }
}

@Controller('api/scripts')
class ApiScriptsController {
    constructor(
        private scriptsService: ScriptsService,
        private filesService: FilesService,
    ) { }

    @Get()
    async searchScripts(@Query() query: ScriptQueryDto) {
        return this.scriptsService.searchScripts(query);
    }

    @Get(':scriptId')
    async getScripts(@Param('scriptId') scriptId: string) {
        if (!Types.ObjectId.isValid(scriptId)) {
            throw new BadRequestException('Invalid scriptId');
        }
        return this.scriptsService.getScriptv2(scriptId);
    }

    @Get(':scriptId/files/:version')
    async getScriptFile(
        @Param('scriptId') scriptId: string,
        @Param('version') version: string,
        @Res() res,
    ) {
        if (!Types.ObjectId.isValid(scriptId)) {
            throw new BadRequestException('Invalid scriptId');
        }
        const ownerId = await this.scriptsService.getOwner(scriptId);
        const buffer = await this.filesService.getFileContent(`${ownerId}/script/${scriptId}/v${version}.json`)
        const filename = `v${version}.json`;
        res.set({
            'Content-Type': 'json',
            'Content-Disposition': `attachment; filename=${filename}`,
            'Content-Length': buffer.length,
        });

        res.send(buffer);
    }
}

export { ApiAuthController, ApiScriptsController }