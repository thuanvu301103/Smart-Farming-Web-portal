import { Controller, Get, Param } from '@nestjs/common';
import { ScriptsService } from './scripts.service';

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
}
