import {
    IsOptional,
    IsString,
    IsEnum,
    IsNumberString,
    IsArray,
    IsMongoId,
    IsNotEmpty,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

enum SortOrder {
    ASC = 'asc',
    DESC = 'desc',
}

class ScriptQueryDto {
    @IsOptional()
    @IsNumberString()
    page?: number = 1;

    @IsOptional()
    @IsNumberString()
    limit?: number = 10;

    @IsOptional()
    @IsString()
    sortBy?: string = 'updatedAt';

    @IsOptional()
    @IsEnum(SortOrder)
    order?: SortOrder = SortOrder.DESC;

    @IsOptional()
    @Transform(({ value }) =>
        Array.isArray(value) ? value : [value]
    )
    @IsArray()
    @IsString({ each: true })
    locations?: string[];

    @IsOptional()
    @Transform(({ value }) =>
        Array.isArray(value) ? value : [value]
    )
    @IsArray()
    @IsString({ each: true })
    plant_types?: string[];
}

class ScriptFileQueryDto {
    @IsNotEmpty()
    @IsMongoId()
    scriptId: string;

    @IsOptional()
    @IsNumberString()
    version: number = 10;
}

export { ScriptQueryDto, ScriptFileQueryDto }