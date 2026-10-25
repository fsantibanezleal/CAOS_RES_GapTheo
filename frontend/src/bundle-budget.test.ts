import { describe, expect, it } from 'vitest';
import { bundleBudgetFindings, MAX_BUNDLE_BYTES } from '../scripts/check-bundle-budget.mjs';

describe('production bundle budget', () => {
  it('adversarial: the production budget rejects oversized chunks and requires separate vendor groups', () => {
    const valid = [
      { name: 'react-vendor-abc.js', bytes: 120_000 },
      { name: 'math-vendor-def.js', bytes: 95_000 },
      { name: 'index-ghi.js', bytes: 80_000 },
    ];
    expect(bundleBudgetFindings(valid)).toEqual([]);
    expect(bundleBudgetFindings([
      ...valid,
      { name: 'oversized.js', bytes: MAX_BUNDLE_BYTES + 1 },
    ])).toContain(`oversized.js is ${MAX_BUNDLE_BYTES + 1} bytes; the limit is ${MAX_BUNDLE_BYTES}`);
    expect(bundleBudgetFindings(valid.filter((file) => !file.name.includes('math-vendor'))))
      .toContain('the separate math-vendor chunk is missing');
    expect(bundleBudgetFindings(valid.filter((file) => !file.name.includes('react-vendor'))))
      .toContain('the separate react-vendor chunk is missing');
  });
});
