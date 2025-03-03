import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { ScriptsModule } from "../scripts/scripts.module";
import { User, UserSchema } from '../../schemas/users.schema';

@Module({
    imports: [
        forwardRef(() => ScriptsModule),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
    providers: [UsersService],
    controllers: [UsersController],
    exports: [UsersService, MongooseModule], // Export UsersService so that other modules canussr this service
})
export class UsersModule { }
