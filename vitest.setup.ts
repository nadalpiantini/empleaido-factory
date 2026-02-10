import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

afterEach(() => {
  cleanup();
});

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    pathname: '/',
    query: {},
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock Next.js dynamic imports
vi.mock('next/dynamic', async () => {
  const actual = await vi.importActual<typeof import('next/dynamic')>('next/dynamic');
  return {
    default: (...args: any[]) => {
      const RequiredComponent = actual.default(args[0]);
      return RequiredComponent;
    },
  };
});
