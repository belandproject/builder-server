import { CollectionGetMiddleware } from './collection_get.middleware';

describe('CollectionGetMiddleware', () => {
  it('should be defined', () => {
    expect(new CollectionGetMiddleware()).toBeDefined();
  });
});
