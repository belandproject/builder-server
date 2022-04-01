import { ItemGetMiddleware } from './item-update.middleware';

describe('ItemGetMiddleware', () => {
  it('should be defined', () => {
    expect(new ItemGetMiddleware()).toBeDefined();
  });
});
