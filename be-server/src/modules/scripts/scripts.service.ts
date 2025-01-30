import { Injectable } from '@nestjs/common';

@Injectable()
export class ScriptsService {
    findAll(): string {
        return 'This action returns all scripts';
    }
}