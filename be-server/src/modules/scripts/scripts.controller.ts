import { Controller, Get } from '@nestjs/common';
import { ScriptsService } from './scripts.service';

@Controller('scripts')
export class ScriptsController {
    constructor(private readonly scriptsService: ScriptsService) { }

    @Get()
    findAll(): string {
        return this.scriptsService.findAll();
    }
}
