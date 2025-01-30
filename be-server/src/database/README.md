# MongoDB Connection

Working with MongoDB in NestJS is straightforward, especially with the help of the `@nestjs/mongoose package`, which integrates Mongoose (an ODM for MongoDB) with NestJS. Here's a step-by-step guide to help you get started:

## Steps to connect to MongoDB 

### Step 1: Install Required Packages
First, install the necessary packages:
```bash
npm install @nestjs/mongoose mongoose
```
### Step 2: Configure the MongoDB Connection
Create a `database.module.ts` file to configure the MongoDB connection:
``typescript
// src/database/database.module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/nestjs-database', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }),
  ],
})
export class DatabaseModule {}
```
### Step 3: Define a Schema
Create a schema for your data models. For example, let's create a user schema:
```typescript
// src/modules/users/schemas/user.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  email: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
```
### Step 4: Create a Module and Service for Users
Define the module, service, and controller for the users:
- User Module
```typescript
// src/modules/users/users.module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User, UserSchema } from './schemas/user.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
```
- User Service
```typescript
// src/modules/users/users.service.ts

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createUser(name: string, email: string): Promise<User> {
    const newUser = new this.userModel({ name, email });
    return newUser.save();
  }

  async findAllUsers(): Promise<User[]> {
    return this.userModel.find().exec();
  }
}
```
- User Controller
```typescript
// src/modules/users/users.controller.ts

import { Controller, Get, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './schemas/user.schema';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(@Body() body: { name: string; email: string }): Promise<User> {
    return this.usersService.createUser(body.name, body.email);
  }

  @Get()
  async findAllUsers(): Promise<User[]> {
    return this.usersService.findAllUsers();
  }
}
```
### Step 5: Integrate the Database Module into the App Module
Import the DatabaseModule and UsersModule into the root AppModule:
```typescript
// src/app.module.ts

import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [DatabaseModule, UsersModule],
})
export class AppModule {}
```

## Schemas

### User
- `username` (String): username
- `links` (Arrray(Object(type: string, link: string))): Addition Bio Links

### Script
- `name` (String): the name of Irrigation Script
- `description` (String): Description of Irrigation Script
- `privacy` (String): privacy status - "public" or "private"
- `owner_id` (ObjectId): Id of owner
