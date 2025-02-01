import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ScriptsService } from './scripts.service';
import { Script } from './schemas/script.schema';

@Controller(':userId/scripts')
export class ScriptsController {
    constructor(private readonly scriptsService: ScriptsService) { }

    @Get()
    async findAllScripts(@Param('userId') userId: string):
        Promise<{
            name: string;
            description: string;
            privacy: string
        }[]>
    {
        //console.log(userId);
        return this.scriptsService.findAllScripts(userId);
    }

    @Get(':scriptId')
    async getScript(@Param('scriptId') scriptId: string):
        Promise<Script> {
        return this.scriptsService.getScript(scriptId);
    }

    @Post()
    async createScript(
        @Body() data: { name: string; description: string; privacy: string },
        @Param('userId') userId: string
    ):
        Promise<{ _id: string }> {
        const newScriptId = await this.scriptsService.createScript(
            userId, data.name, data.description, data.privacy
        );
        return { _id: newScriptId};
    }

    @Put(':scriptId')
    async updateScript(@Param('scriptId') scriptId: string, @Body() updatedData: any) {
        return await this.scriptsService.updateScriptInfo(scriptId, updatedData);
    }

    @Delete(':scriptId')
    async deleteScript(@Param('scriptId') scriptId: string) {
        return await this.scriptsService.deleteScript(scriptId);
    }
}
