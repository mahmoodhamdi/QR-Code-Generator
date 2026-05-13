import { formatDate, formatDistanceToNow } from '@/lib/utils/date';

describe('date utils', () => {
  describe('formatDistanceToNow', () => {
    const fixedNow = new Date('2026-05-13T12:00:00Z');

    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(fixedNow);
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('returns "just now" for sub-minute differences', () => {
      const past = new Date(fixedNow.getTime() - 30 * 1000);
      expect(formatDistanceToNow(past)).toBe('just now');
    });

    it('returns minutes for under-hour differences', () => {
      const past = new Date(fixedNow.getTime() - 5 * 60 * 1000);
      expect(formatDistanceToNow(past)).toBe('5 minutes ago');
    });

    it('singularises 1 minute', () => {
      const past = new Date(fixedNow.getTime() - 60 * 1000);
      expect(formatDistanceToNow(past)).toBe('1 minute ago');
    });

    it('returns hours for under-day differences', () => {
      const past = new Date(fixedNow.getTime() - 3 * 60 * 60 * 1000);
      expect(formatDistanceToNow(past)).toBe('3 hours ago');
    });

    it('singularises 1 hour', () => {
      const past = new Date(fixedNow.getTime() - 60 * 60 * 1000);
      expect(formatDistanceToNow(past)).toBe('1 hour ago');
    });

    it('returns days for under-week differences', () => {
      const past = new Date(fixedNow.getTime() - 3 * 24 * 60 * 60 * 1000);
      expect(formatDistanceToNow(past)).toBe('3 days ago');
    });

    it('returns weeks for under-4-week differences', () => {
      const past = new Date(fixedNow.getTime() - 14 * 24 * 60 * 60 * 1000);
      expect(formatDistanceToNow(past)).toBe('2 weeks ago');
    });

    it('returns months for under-year differences', () => {
      const past = new Date(fixedNow.getTime() - 90 * 24 * 60 * 60 * 1000);
      expect(formatDistanceToNow(past)).toBe('3 months ago');
    });

    it('returns years for very old dates', () => {
      const past = new Date(fixedNow.getTime() - 800 * 24 * 60 * 60 * 1000);
      expect(formatDistanceToNow(past)).toBe('2 years ago');
    });
  });

  describe('formatDate', () => {
    it('formats a date with the expected fields', () => {
      const result = formatDate(new Date('2026-05-13T12:34:00Z'));
      expect(result).toMatch(/2026/);
      expect(result).toMatch(/May/);
      expect(result).toMatch(/13/);
    });
  });
});
