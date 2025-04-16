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

class BaseSearchUserQueryDto {
    @IsOptional()
    @IsNumberString()
    page?: number = 1;

    @IsOptional()
    @IsNumberString()
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