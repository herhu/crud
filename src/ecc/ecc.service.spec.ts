import { Test, TestingModule } from '@nestjs/testing';
import { EccService } from './ecc.service';

describe('EccService', () => {
  let service: EccService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EccService],
    }).compile();

    service = module.get<EccService>(EccService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
