import {
    IsOptional,
    IsString,
    IsEnum,
    IsNumberString, IsInt, Min,
    IsArray,
    IsMongoId,
    IsNotEmpty,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

enum SortOrder {
    ASC = 'asc',
    DESC = 'desc',
}

class BaseSearchScriptQueryDto {
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit?: number = 10;

    @IsOptional()
    @IsString()
    sortBy?: string = 'updatedAt';

    @IsOptional()
    @IsEnum(SortOrder)
    order?: SortOrder = SortOrder.DESC;
}

class ScriptQueryDto extends BaseSearchScriptQueryDto {
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

export { BaseSearchScriptQueryDto,  ScriptQueryDto, ScriptFileQueryDto }