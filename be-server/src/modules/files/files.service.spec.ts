import { Test, TestingModule } from '@nestjs/testing';
import { FilesService } from './files.service';
import { ConfigModule } from '@nestjs/config';

describe('FilesService', () => {
  let service: FilesService;

  beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
          imports: [ConfigModule.forRoot()],
          providers: [FilesService],
    }).compile();

      service = module.get<FilesService>(FilesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

    it('parallel user test', async () => {
        const totalRequests = 500;
        const start = Date.now();
        const results = await Promise.all(
            Array.from({ length: totalRequests }).map(() => service.getFileContent('67c273401fb713deae4b068c/script/67e75e0b2f8c12e06092ee02/v1.0.json')),
        );
        const duration = Date.now() - start;
        console.log(`✅ 500 calls done in ${duration}ms`);

        expect(results.length).toBe(totalRequests);
    });
});
