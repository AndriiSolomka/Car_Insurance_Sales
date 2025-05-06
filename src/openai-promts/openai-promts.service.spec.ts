import { Test, TestingModule } from '@nestjs/testing';
import { OpenaiPromtsService } from './openai-promts.service';

describe('OpenaiPromtsService', () => {
  let service: OpenaiPromtsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OpenaiPromtsService],
    }).compile();

    service = module.get<OpenaiPromtsService>(OpenaiPromtsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
