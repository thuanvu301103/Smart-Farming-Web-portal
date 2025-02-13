import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ModelsService } from './models.service';
import { Models } from '../../schemas/models.schema';

@Controller(':userId/models')
export class ModelsController {
    constructor(private readonly modelsService: ModelsService) { }

    @Get()
    async findAllModels(@Param('userId') userId: string):
        Promise<{
            name: string;
            description: string;
        }[]> {
        return this.modelsService.findAllModels(userId);
    }

    @Get(':modelId')
    async getModel(@Param('modelId') modelId: string):
        Promise<Models> {
        return this.modelsService.getModel(modelId);
    }

    @Post()
    async addModel(
        @Body() data: { name: string; description: string},
        @Param('userId') userId: string
    ):
        Promise<{ _id: string }> {
        const newModelId = await this.modelsService.addModel(
            userId, data.name, data.description
        );
        return { _id: newModelId };
    }

    @Put(':modelId')
    async updateModel(@Param('modelId') modelId: string, @Body() updatedData: any) {
        return await this.modelsService.updateModelInfo(modelId, updatedData);
    }

    @Delete(':modelId')
    async deleteModel(@Param('modelId') modelId: string) {
        return await this.modelsService.deleteModel(modelId);
    }
}

@Controller(':userId/models/:modelId/scripts')
export class ModelScriptsController {
    constructor(private readonly modelsService: ModelsService) { }

    @Get()
    async findAllScripts(@Param('modelId') modelId: string):
        Promise<{
            name: string;
            description: string;
            privacy: string
        }[]> {
        return this.modelsService.findAllScripts(modelId);
    }

    @Post()
    async addScript(
        @Body() data: { name: string; description: string, privacy: string },
        @Param('userId') userId: string,
        @Param('modelId') modelId: string,
    ):
        Promise<{ _id: string }> {
        const newScriptId = await this.modelsService.addScript(
            data.name, data.description, data.privacy, userId, modelId
        );
        return { _id: newScriptId };
    }
}
