import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [
        ConfigModule,
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => {
                const mongodbUri = configService.get<string>('MONGODB_URI');
                console.log('MongoDB URI:', mongodbUri);  // In ra URI MongoDB

                return {
                    uri: mongodbUri,
                };
            },
            inject: [ConfigService],
        }),
    ],
})
export class DatabaseModule { }
