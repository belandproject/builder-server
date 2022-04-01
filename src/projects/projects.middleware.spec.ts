import { ProjectsMiddleware } from './projects.middleware';

describe('ProjectsMiddleware', () => {
  it('should be defined', () => {
    expect(new ProjectsMiddleware()).toBeDefined();
  });
});
