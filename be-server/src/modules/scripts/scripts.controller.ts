import { Controller, Get, Post, Body, Param } from '@nestjs/common';
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
}
