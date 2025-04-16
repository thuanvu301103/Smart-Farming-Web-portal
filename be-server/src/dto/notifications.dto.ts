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

class BaseSearchNotificationQueryDto {
    @IsOptional()
    @IsNumberString()
    page?: number = 1;

    @IsOptional()
    @IsNumberString()
    limit?: number = 10;

    @IsOptional()
    @IsString()
    sortBy?: string = 'createdAt';

    @IsOptional()
    @IsEnum(SortOrder)
    order?: SortOrder = SortOrder.DESC;

    @IsOptional()
    @IsMongoId()
    notifyId?: string;
}

export { BaseSearchNotificationQueryDto }