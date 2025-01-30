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

## Basic structure of a Back-end Server
```
nestjs-backend/
├── src/
│   ├── app.module.ts
│   ├── main.ts
│   ├── common/
│   │   ├── filters/
│   │   ├── guards/
│   │   ├── interceptors/
│   │   ├── pipes/
│   ├── modules/
│   │   ├── users/
│   │   │   ├── users.module.ts
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   ├── schemas/
│   │   │   │   ├── user.schema.ts
│   │   ├── auth/
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── strategies/
│   │   │   │   ├── jwt.strategy.ts
│   │   │   │   ├── local.strategy.ts
│   ├── config/
│   │   ├── config.module.ts
│   │   ├── config.service.ts
│   ├── database/
│   │   ├── database.module.ts
│   │   ├── database.service.ts
├── test/
│   ├── app.e2e-spec.ts
│   ├── jest-e2e.json
├── .env
├── .gitignore
├── nest-cli.json
├── package.json
├── tsconfig.json
```
Explanation:
- `src/`: Main source directory.
	- `app.module.ts`: Root module.
	- `main.ts`: Entry point of the application.
	- `common/`: Directory for common utilities like filters, guards, interceptors, and pipes.
	- `modules/`: Directory for feature-specific modules.
		- `users/`: Users feature module.
			- `users.module.ts`: Defines the users module.
			- `users.controller.ts`: Handles users-related requests.
			- `users.service.ts`: Contains business logic for users.
			- `schemas/`: Directory for Mongoose schemas (optional).
				- `user.schema.ts`: Mongoose schema for user entity.
		- `auth/`: Authentication module…
	- `config/`: Configuration files for the application.
	- `database/`: Database configuration module and service.
- `test/`: Directory for test-related files.

## Run the application
Start the NestJS application:
```bash
npm run start
```
The server will start, and you can access the endpoint at `http://localhost:3000/scripts`