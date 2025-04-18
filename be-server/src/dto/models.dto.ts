import {
    IsOptional,
    IsString,
    IsEnum,
    IsInt, Min,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

enum SortOrder {
    ASC = 'asc',
    DESC = 'desc',
}

class BaseSearchModelQueryDto {
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

export { BaseSearchModelQueryDto }