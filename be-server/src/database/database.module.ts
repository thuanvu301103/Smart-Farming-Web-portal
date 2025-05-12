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
                const mlflowUrl = configService.get<string>('MLFLOW_TRACKING_SERVER');
                console.log('MongoDB URI:', mongodbUri);  // In ra URI MongoDB
                console.log('MLFlow URI:', mlflowUrl);  // In ra URI Mlflow
                return {
                    uri: mongodbUri,
                };
            },
            inject: [ConfigService],
        }),
    ],
})
export class DatabaseModule { }
