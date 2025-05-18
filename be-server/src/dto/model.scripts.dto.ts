import {
    IsOptional,
    IsString,
    IsEnum,
    IsNumberString, IsInt, Min,
    IsArray,
    IsMongoId,
    IsNotEmpty,
    IsIn,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

enum SortOrder {
    ASC = 'asc',
    DESC = 'desc',
}

class BaseSearchModelScriptQueryDto {
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
    sortBy?: string = 'createdAt';

    @IsOptional()
    @IsEnum(SortOrder)
    order?: SortOrder = SortOrder.DESC;

    @IsOptional()
    @IsString()
    location?: string;

    @IsOptional()
    @IsString()
    model_name?: string;
}

export { BaseSearchModelScriptQueryDto }
