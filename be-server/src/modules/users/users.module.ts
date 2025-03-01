import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User, UserSchema } from '../../schemas/users.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
    providers: [UsersService],
    controllers: [UsersController],
    exports: [UsersService], // Export UsersService so that other modules canussr this service
})
export class UsersModule { }
