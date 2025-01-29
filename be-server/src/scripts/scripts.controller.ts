import { Controller, Get } from '@nestjs/common';
import { ScriptsService } from './scripts.service';

@Controller('scripts')
export class ScriptsController {
    constructor(private readonly scriptsService: ScriptsService) { }

    @Get()
    async findAll() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(this.scriptsService.findAll());
            }, 5000); // Delay response by 5 seconds
        });
    }
}
