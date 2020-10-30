import { formatDuration } from './format-duration';


describe('formatDuration', () => {

  it('should format a duration', () => {
    expect(formatDuration(1)).toBe('00:00:01');
  });

});
