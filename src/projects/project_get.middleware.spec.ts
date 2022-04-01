import { ProjectGetMiddleware } from './project_get.middleware';

describe('ProjectGetMiddleware', () => {
  it('should be defined', () => {
    expect(new ProjectGetMiddleware()).toBeDefined();
  });
});
