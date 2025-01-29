# Nest.js-project-for-Back-end-server
A simple NestJS project for Back-end Server

## Initial a Nest.js project
Follow these steps:
- Step 1 - Install `Node.js` and `npm`: Make sure you have `Node.js` and `npm` (Node Package Manager) installed on your machine
- Step 2 - Install `NestJS CLI`: Install the `NestJS CLI` globally using `npm`
```bash
npm install -g @nestjs/cli
```
- Step 3 - Create a New Project: Create a new NestJS project using the CLI
```bash
nest new project-name
```
Navigate to the project directory
- Step 4 - Create a Module: Generate a new module (e.g. `scripts` module)
```bash
nest generate module scripts
```
- Step 5 - Create a Controller: Generate a new controller for the module
```bash 
nest generate controller scripts
```
- Step 6 - Create a Service: Generate a new service for the module
```bash
nest generate service scripts
```

## Update created files
- Step 1 - Define the Controller: Edit the generated controller file (`scripts.controller.ts`) to define the routes and handlers:
```typescript
import {Controller, Get} from '@nestjs/common';
import { CatsService } from './cats.service';

@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Get()
  findAll(): string {
    return this.catsService.findAll();
  }}
```

- Step 2 - Define the Service: Edit the generated service file (`scripts.service.ts`) to implement the business logic
```typescript
import { Injectable } from '@nestjs/common';
@Injectable()
export class ScriptsService {
  findAll(): string {
    return 'This action returns all scripts';
  }}
```

- Step 3 - Update the Module: Ensure that the module file (`scripts.module.ts`) imports and provides the controller and service
```typescript
import { Module } from '@nestjs/common';
import {ScriptsController} from './scripts.controller';
import {ScriptsService} from './scripts.service';
@Module({
  controllers: [ScriptsController],
  providers: [ScriptsService],})
export class ScriptsModule {}
```

## Cross-Origin Resource Sharing
`CORS`, or Cross-Origin Resource Sharing, is a security feature implemented by web browsers to control how resources on a web page can be requested from another domain outside the domain from which the resource originated. In simpler terms, it allows or restricts web applications running at one origin (domain) from interacting with resources from a different origin
NestJS provides a simple way to enable CORS using the `enableCors` method. You can enable CORS in your `main.ts file:
```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors();

  await app.listen(3000);}
bootstrap();
```

## Run the application
Start the NestJS application:
```bash
npm run start
```
The server will start, and you can access the endpoint at `http://localhost:3000/scripts`