import { managementConfigsPlugin } from './plugin';

describe('management-configs', () => {
  it('should export plugin', () => {
    expect(managementConfigsPlugin).toBeDefined();
  });
});
