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

class BaseSearchUserQueryDto {
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
    sortBy?: string = 'username';

    @IsOptional()
    @IsEnum(SortOrder)
    order?: SortOrder = SortOrder.DESC;
}

class SearchUserByIdQueryDto extends BaseSearchUserQueryDto {
    @IsOptional()
    @Transform(({ value }) => Array.isArray(value) ? value : [value])
    @IsArray()
    @IsMongoId({ each: true })
    ids?: string[];
}

class SearchUserByNameQueryDto extends BaseSearchUserQueryDto {
    @IsString()
    username: string;
}


export { SearchUserByIdQueryDto, SearchUserByNameQueryDto }