import { describe, expect, it } from "vitest";
import {
  computeCertificate,
  frac,
  gapCountHistory,
  gcd,
  starDiscrepancy,
} from "./gapEngine";

describe("GapTheo direct certificate", () => {
  it("adversarial: the irrational cyclic partition stays within three lengths and closes", () => {
    const certificate = computeCertificate({
      alpha: (Math.sqrt(5) - 1) / 2,
      alphaMode: "irrational",
      pointCount: 34,
      allocator: "rotation",
    });
    expect(certificate.distinctCount).toBeLessThanOrEqual(3);
    expect(certificate.sumCheck.holds).toBe(true);
    expect(certificate.theoremStatus).toBe("certified");
  });

  it("adversarial: rational residue collisions remain theorem boundaries", () => {
    const certificate = computeCertificate({
      alpha: 5 / 13,
      alphaMode: "rational",
      rationalP: 5,
      rationalQ: 13,
      pointCount: 34,
      allocator: "rotation",
    });
    expect(certificate.theoremStatus).toBe("boundary");
    expect(
      new Set(certificate.points.map((point) => point.value.toFixed(8))).size,
    ).toBeLessThan(34);
  });

  it("adversarial: numeric angle edits never assert irrationality", () => {
    const certificate = computeCertificate({
      alpha: 0.501,
      alphaMode: "numeric",
      pointCount: 34,
      allocator: "rotation",
    });
    expect(certificate.theoremStatus).toBe("boundary");
    expect(certificate.theoremMessage).toMatch(/irrationality is not established/i);
  });

  it("adversarial: seeded random, farthest insertion, and anchored insertion stay outside the theorem claim", () => {
    const randomA = computeCertificate({
      pointCount: 22,
      allocator: "random",
      seed: 42,
    });
    const randomB = computeCertificate({
      pointCount: 22,
      allocator: "random",
      seed: 42,
    });
    const farthest = computeCertificate({
      pointCount: 22,
      allocator: "farthest",
    });
    const anchored = computeCertificate({ pointCount: 22, allocator: "anchors", anchorCount: 4, phase: 0.1 });
    expect(randomA.points.map((point) => point.value)).toEqual(
      randomB.points.map((point) => point.value),
    );
    expect(randomA.theoremStatus).toBe("contrast");
    expect(farthest.theoremStatus).toBe("contrast");
    expect(anchored.theoremStatus).toBe("contrast");
    expect(anchored.points.slice(0, 4).map((point) => point.value)).toEqual([0.1, 0.35, 0.6, 0.85]);
    expect(anchored.points.map((point) => point.value)).not.toEqual(farthest.points.map((point) => point.value));
  });

  it("exposes deterministic elementary arithmetic", () => {
    expect(frac(-0.25)).toBeCloseTo(0.75);
    expect(gcd(55, 34)).toBe(1);
  });

  it("computes finite discrepancy and the N-event sweep", () => {
    const scenario = {
      alpha: Math.sqrt(2) - 1,
      alphaMode: "irrational" as const,
      pointCount: 24,
      allocator: "rotation" as const,
    };
    const certificate = computeCertificate(scenario);
    expect(starDiscrepancy(certificate.points)).toBeGreaterThan(0);
    expect(starDiscrepancy(certificate.points)).toBeLessThanOrEqual(1);
    const history = gapCountHistory(certificate.scenario);
    expect(history).toHaveLength(22);
    expect(Math.max(...history.map((item) => item.count))).toBeLessThanOrEqual(
      3,
    );
  });

  it("computes the two-dimensional Kronecker torus nearest-neighbor contrast", () => {
    const certificate = computeCertificate({ alpha: Math.sqrt(2) - 1, beta: Math.sqrt(3) - 1, pointCount: 20 });
    expect(certificate.extension.points).toHaveLength(18);
    expect(certificate.extension.points.every((point) => point.x >= 0 && point.x < 1 && point.y >= 0 && point.y < 1)).toBe(true);
    expect(certificate.extension.points.every((point) => point.nearest > 0 && point.group >= 0)).toBe(true);
    expect(certificate.extension.distinctCount).toBe(certificate.extension.groups.length);
    expect(certificate.extension.groups.reduce((sum, group) => sum + group.count, 0)).toBe(18);
  });

  it("uses a circular minimum spanning tree for finite H0 bars", () => {
    const certificate = computeCertificate({
      alpha: (Math.sqrt(5) - 1) / 2,
      alphaMode: "irrational",
      pointCount: 13,
      allocator: "rotation",
    });
    expect(certificate.topology.bars).toHaveLength(certificate.gaps.length - 1);
    expect(certificate.topology.bars.map((bar) => bar.id)).not.toContain(
      certificate.gaps.reduce((largest, gap) => gap.length > largest.length ? gap : largest).id,
    );
    const event = certificate.topology.events.at(-1);
    expect(event?.components).toBe(1);
  });

  it("recomputes dual visits under the selected endpoint convention", () => {
    const base = {
      alpha: 0.25,
      alphaMode: "numeric" as const,
      pointCount: 16,
      phase: 0,
      beta: 0.5,
      allocator: "rotation" as const,
    };
    const strict = computeCertificate({ ...base, strictBeta: true });
    const inclusive = computeCertificate({ ...base, strictBeta: false });
    expect(inclusive.dual.selected).not.toEqual(strict.dual.selected);
    expect(inclusive.dual.selected).toContain(2);
    expect(strict.dual.selected).not.toContain(2);
  });
});
