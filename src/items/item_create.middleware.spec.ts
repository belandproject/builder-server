import { ItemCreateMiddleware } from './item_create.middleware';

describe('ItemCreateMiddleware', () => {
  it('should be defined', () => {
    expect(new ItemCreateMiddleware()).toBeDefined();
  });
});
