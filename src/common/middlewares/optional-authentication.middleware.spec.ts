import { OptionalAuthenticationMiddleware } from './optional-authentication.middleware';

describe('OptionalAuthenticationMiddleware', () => {
  it('should be defined', () => {
    expect(new OptionalAuthenticationMiddleware()).toBeDefined();
  });
});
