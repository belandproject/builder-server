import { Test, TestingModule } from '@nestjs/testing';
import { AssetPacksService } from './asset-packs.service';

describe('AssetPacksService', () => {
  let service: AssetPacksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AssetPacksService],
    }).compile();

    service = module.get<AssetPacksService>(AssetPacksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
