import { describe, expect, it } from 'vitest';
import { computeCertificate, frac, gcd } from './gapEngine';

describe('GapTheo direct certificate', () => {
  it('keeps the irrational rotation within the three-gap bound', () => {
    const certificate = computeCertificate({ alpha: (Math.sqrt(5) - 1) / 2, alphaMode: 'irrational', pointCount: 34, allocator: 'rotation' });
    expect(certificate.distinctCount).toBeLessThanOrEqual(3);
    expect(certificate.sumCheck.holds).toBe(true);
    expect(certificate.theoremStatus).toBe('certified');
  });

  it('marks rational residue collisions as a boundary', () => {
    const certificate = computeCertificate({ alpha: 5 / 13, alphaMode: 'rational', rationalP: 5, rationalQ: 13, pointCount: 34, allocator: 'rotation' });
    expect(certificate.theoremStatus).toBe('boundary');
    expect(new Set(certificate.points.map((point) => point.value.toFixed(8))).size).toBeLessThan(34);
  });

  it('keeps seeded random and farthest insertion outside the theorem claim', () => {
    const randomA = computeCertificate({ pointCount: 22, allocator: 'random', seed: 42 });
    const randomB = computeCertificate({ pointCount: 22, allocator: 'random', seed: 42 });
    const farthest = computeCertificate({ pointCount: 22, allocator: 'farthest' });
    expect(randomA.points.map((point) => point.value)).toEqual(randomB.points.map((point) => point.value));
    expect(randomA.theoremStatus).toBe('contrast');
    expect(farthest.theoremStatus).toBe('contrast');
  });

  it('exposes deterministic elementary arithmetic', () => {
    expect(frac(-0.25)).toBeCloseTo(0.75);
    expect(gcd(55, 34)).toBe(1);
  });
});
