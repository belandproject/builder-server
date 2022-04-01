import { Test, TestingModule } from '@nestjs/testing';
import { AssetPacksController } from './asset-packs.controller';
import { AssetPacksService } from './asset-packs.service';

describe('AssetPacksController', () => {
  let controller: AssetPacksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssetPacksController],
      providers: [AssetPacksService],
    }).compile();

    controller = module.get<AssetPacksController>(AssetPacksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
