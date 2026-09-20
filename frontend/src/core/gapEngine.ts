export type Allocator = "rotation" | "random" | "farthest" | "anchors";
export type AlphaMode = "irrational" | "rational" | "numeric";

export interface Scenario {
  alpha: number;
  alphaMode: AlphaMode;
  rationalP: number;
  rationalQ: number;
  pointCount: number;
  phase: number;
  beta: number;
  allocator: Allocator;
  seed: number;
  anchorCount: number;
  strictBeta: boolean;
}

export interface OrbitPoint {
  id: string;
  index: number;
  value: number;
  source: string;
}

export interface Gap {
  id: string;
  start: number;
  end: number;
  length: number;
  type: string;
  rank: number;
}

export interface GapGroup {
  type: string;
  length: number;
  count: number;
  share: number;
  color: string;
}

export interface LineageStep {
  index: number;
  value: number;
  parentId: string | null;
  parentLength: number;
  childLengths: [number, number] | null;
  split: boolean;
}

export interface FareyPrediction {
  left: [number, number];
  right: [number, number];
  candidates: Array<{
    label: string;
    length: number;
    count: number;
    color: string;
  }>;
  valid: boolean;
}

export interface ContinuedFraction {
  terms: number[];
  convergents: Array<{ p: number; q: number; error: number }>;
}

export interface DualResult {
  selected: number[];
  returnGaps: number[];
  groups: GapGroup[];
  regime: "two-gap" | "three-gap" | "empty" | "boundary";
}

export interface TopologyResult {
  threshold: number;
  components: number;
  events: Array<{ threshold: number; components: number; gapIds: string[] }>;
  bars: Array<{ id: string; birth: number; death: number }>;
}

export interface WordResult {
  word: string;
  palette: Record<string, string>;
  symmetry: { anchor: number; matched: number; total: number };
}

export interface LatticeVector {
  x: number;
  y: number;
  norm: number;
  active: boolean;
}

export interface Certificate {
  scenario: Scenario;
  points: OrbitPoint[];
  sortedPoints: OrbitPoint[];
  gaps: Gap[];
  groups: GapGroup[];
  distinctCount: number;
  sumCheck: { holds: boolean; residual: number; relation: string };
  theoremStatus: "certified" | "boundary" | "contrast" | "warning";
  theoremMessage: string;
  lineage: LineageStep[];
  farey: FareyPrediction;
  continuedFraction: ContinuedFraction;
  dual: DualResult;
  topology: TopologyResult;
  word: WordResult;
  lattice: LatticeVector[];
  extension: { points: number[]; distinctCount: number; groups: GapGroup[] };
}

export const GAP_COLORS = ["#f1b66e", "#58d2c2", "#d98cff"];
const TAU = Math.PI * 2;

export function frac(value: number): number {
  const result = value - Math.floor(value);
  return result >= 1 - 1e-12 ? 0 : result;
}

export function gcd(a: number, b: number): number {
  let x = Math.abs(Math.trunc(a));
  let y = Math.abs(Math.trunc(b));
  while (y) [x, y] = [y, x % y];
  return x || 1;
}

export function normalizeScenario(input: Partial<Scenario>): Scenario {
  const q = Math.max(1, Math.round(input.rationalQ ?? 13));
  const p = Math.round(input.rationalP ?? 5);
  const alphaMode = input.alphaMode ?? "irrational";
  const alpha =
    alphaMode === "rational"
      ? frac(p / q)
      : frac(
          Number.isFinite(input.alpha)
            ? Number(input.alpha)
            : (Math.sqrt(5) - 1) / 2,
        );
  return {
    alpha,
    alphaMode,
    rationalP: p,
    rationalQ: q,
    pointCount: Math.min(900, Math.max(3, Math.round(input.pointCount ?? 34))),
    phase: frac(input.phase ?? 0),
    beta: Math.min(0.98, Math.max(0.02, input.beta ?? 0.31)),
    allocator: input.allocator ?? "rotation",
    seed: Math.round(input.seed ?? 17),
    anchorCount: Math.min(4, Math.max(1, Math.round(input.anchorCount ?? 1))),
    strictBeta: input.strictBeta ?? true,
  };
}

function makeRandom(seed: number): () => number {
  let state = (seed | 0) ^ 0x9e3779b9;
  return () => {
    state = Math.imul(state ^ (state >>> 15), 1 | state);
    state ^= state + Math.imul(state ^ (state >>> 7), 61 | state);
    return ((state ^ (state >>> 14)) >>> 0) / 4294967296;
  };
}

function rationalValue(scenario: Scenario, index: number): number {
  const q = Math.max(1, scenario.rationalQ);
  const residue = (((scenario.rationalP * index) % q) + q) % q;
  return frac(scenario.phase + residue / q);
}

function sortNumbers(values: number[]): number[] {
  return [...values].sort((a, b) => a - b);
}

function gapsFromSorted(points: OrbitPoint[]): Gap[] {
  const sorted = [...points].sort((a, b) => a.value - b.value);
  return sorted.map((point, index) => {
    const next = sorted[(index + 1) % sorted.length];
    const length =
      index === sorted.length - 1
        ? 1 - point.value + next.value
        : next.value - point.value;
    return {
      id: "gap-" + index,
      start: point.value,
      end: next.value,
      length,
      type: "",
      rank: index,
    };
  });
}

function gapGroups(gaps: Gap[]): GapGroup[] {
  const ordered = [...gaps].sort((a, b) => a.length - b.length);
  const groups: GapGroup[] = [];
  ordered.forEach((gap) => {
    const current = groups.find(
      (group) => Math.abs(group.length - gap.length) < 1e-8,
    );
    if (current) current.count += 1;
    else {
      const index = groups.length;
      groups.push({
        type: String.fromCharCode(97 + index),
        length: gap.length,
        count: 1,
        share: 0,
        color: GAP_COLORS[index] ?? "#9aa6b2",
      });
    }
  });
  groups.forEach((group) => {
    group.share = group.count / Math.max(1, gaps.length);
  });
  gaps.forEach((gap) => {
    const group = groups.find(
      (item) => Math.abs(item.length - gap.length) < 1e-8,
    );
    gap.type = group?.type ?? "?";
  });
  return groups;
}

function allocatorValues(scenario: Scenario): OrbitPoint[] {
  const values: number[] = [];
  if (scenario.allocator === "rotation") {
    for (let index = 0; index < scenario.pointCount; index += 1) {
      values.push(
        scenario.alphaMode === "rational"
          ? rationalValue(scenario, index)
          : frac(scenario.phase + index * scenario.alpha),
      );
    }
  } else if (scenario.allocator === "random") {
    const random = makeRandom(scenario.seed);
    for (let index = 0; index < scenario.pointCount; index += 1)
      values.push(random());
  } else {
    values.push(frac(scenario.phase));
    for (let index = 1; index < scenario.pointCount; index += 1) {
      const current = sortNumbers(values);
      const currentGaps = current.map((value, i) => {
        const next = current[(i + 1) % current.length];
        return {
          start: value,
          length: i === current.length - 1 ? 1 - value + next : next - value,
        };
      });
      const largest = [...currentGaps].sort(
        (a, b) => b.length - a.length || a.start - b.start,
      )[0];
      values.push(frac(largest.start + largest.length / 2));
    }
  }
  return values.map((value, index) => ({
    id: "point-" + index,
    index,
    value,
    source: scenario.allocator,
  }));
}

function incrementalLineage(points: OrbitPoint[]): LineageStep[] {
  const lineage: LineageStep[] = [];
  const current: OrbitPoint[] = [];
  points.forEach((point, index) => {
    if (index === 0) {
      current.push(point);
      lineage.push({
        index,
        value: point.value,
        parentId: null,
        parentLength: 1,
        childLengths: null,
        split: false,
      });
      return;
    }
    const previous = gapsFromSorted(current);
    const parent = previous.find((gap) => {
      if (gap.start < gap.end)
        return point.value > gap.start + 1e-10 && point.value < gap.end - 1e-10;
      return point.value > gap.start + 1e-10 || point.value < gap.end - 1e-10;
    });
    const parentLength = parent?.length ?? 0;
    const first = parent
      ? point.value >= parent.start
        ? point.value - parent.start
        : 1 - parent.start + point.value
      : 0;
    const second = Math.max(0, parentLength - first);
    current.push(point);
    lineage.push({
      index,
      value: point.value,
      parentId: parent?.id ?? null,
      parentLength,
      childLengths: parent ? [first, second] : null,
      split: Boolean(parent),
    });
  });
  return lineage;
}

function fareySequence(order: number): Array<[number, number]> {
  const result: Array<[number, number]> = [[0, 1]];
  for (let denominator = 1; denominator <= order; denominator += 1) {
    for (let numerator = 1; numerator < denominator; numerator += 1) {
      if (gcd(numerator, denominator) === 1)
        result.push([numerator, denominator]);
    }
  }
  result.push([1, 1]);
  return result.sort((a, b) => a[0] / a[1] - b[0] / b[1] || a[1] - b[1]);
}

function fareyPrediction(alpha: number, pointCount: number): FareyPrediction {
  const sequence = fareySequence(Math.min(80, Math.max(3, pointCount - 1)));
  let left: [number, number] = sequence[0];
  let right: [number, number] = sequence[sequence.length - 1];
  for (let index = 0; index < sequence.length - 1; index += 1) {
    const a = sequence[index];
    const b = sequence[index + 1];
    if (a[0] / a[1] <= alpha && alpha <= b[0] / b[1]) {
      left = a;
      right = b;
      break;
    }
  }
  const [a, b] = left;
  const [c, d] = right;
  const candidates = [
    {
      label: "a",
      length: Math.max(0, b * alpha - a),
      count: Math.max(0, pointCount - b),
      color: GAP_COLORS[0],
    },
    {
      label: "b",
      length: Math.max(0, c - d * alpha),
      count: Math.max(0, pointCount - d),
      color: GAP_COLORS[1],
    },
  ];
  const thirdCount = b + d - pointCount;
  if (thirdCount > 0) {
    candidates.push({
      label: "c",
      length: Math.max(0, (b - d) * alpha + c - a),
      count: thirdCount,
      color: GAP_COLORS[2],
    });
  }
  return {
    left,
    right,
    candidates,
    valid: candidates.every(
      (candidate) => candidate.count > 0 && candidate.length > 0,
    ),
  };
}

function continuedFraction(value: number, depth = 9): ContinuedFraction {
  let rest = Math.min(0.999999999, Math.max(0.000000001, value));
  const terms: number[] = [];
  const convergents: Array<{ p: number; q: number; error: number }> = [];
  let pMinus2 = 0;
  let pMinus1 = 1;
  let qMinus2 = 1;
  let qMinus1 = 0;
  for (let index = 0; index < depth; index += 1) {
    const term = Math.floor(rest);
    terms.push(term);
    const p = term * pMinus1 + pMinus2;
    const q = term * qMinus1 + qMinus2;
    convergents.push({ p, q, error: Math.abs(q * value - p) });
    pMinus2 = pMinus1;
    pMinus1 = p;
    qMinus2 = qMinus1;
    qMinus1 = q;
    const fractional = rest - term;
    if (fractional < 1e-10) break;
    rest = 1 / fractional;
  }
  return { terms, convergents };
}

function dualResult(scenario: Scenario): DualResult {
  const selected: number[] = [];
  for (let index = 0; index < scenario.pointCount * 3; index += 1) {
    const value =
      scenario.alphaMode === "rational"
        ? rationalValue(scenario, index)
        : frac(scenario.phase + index * scenario.alpha);
    if (scenario.strictBeta ? value < scenario.beta : value <= scenario.beta)
      selected.push(index);
  }
  const returnGaps = selected
    .slice(1)
    .map((value, index) => value - selected[index]);
  const fakeGaps = returnGaps.map((length, index) => ({
    id: "return-" + index,
    start: index,
    end: index + length,
    length,
    type: "",
    rank: index,
  }));
  const groups = gapGroups(fakeGaps);
  return {
    selected: selected.slice(0, scenario.pointCount),
    returnGaps: returnGaps.slice(0, Math.max(0, scenario.pointCount - 1)),
    groups,
    regime:
      groups.length === 0
        ? "empty"
        : groups.length === 2
          ? "two-gap"
          : groups.length === 3
            ? "three-gap"
            : "boundary",
  };
}

function topology(gaps: Gap[], threshold: number): TopologyResult {
  const unique = [
    ...new Set(gaps.map((gap) => Number(gap.length.toFixed(8)))),
  ].sort((a, b) => a - b);
  const events = unique.map((value) => ({
    threshold: value,
    components: Math.max(
      1,
      gaps.filter((gap) => gap.length > value + 1e-8).length,
    ),
    gapIds: gaps
      .filter((gap) => Math.abs(gap.length - value) < 1e-8)
      .map((gap) => gap.id),
  }));
  const bars = gaps.map((gap, index) => ({
    id: "bar-" + index,
    birth: 0,
    death: gap.length,
  }));
  return {
    threshold,
    components: Math.max(
      1,
      gaps.filter((gap) => gap.length > threshold + 1e-8).length,
    ),
    events,
    bars,
  };
}

function word(gaps: Gap[], groups: GapGroup[]): WordResult {
  const palette = Object.fromEntries(
    groups.map((group) => [group.type, group.color]),
  );
  const largest = groups[groups.length - 1]?.type ?? "c";
  const anchor = gaps.findIndex((gap) => gap.type === largest);
  let matched = 0;
  if (anchor >= 0) {
    for (let offset = 1; offset < Math.floor(gaps.length / 2); offset += 1) {
      const left = gaps[(anchor - offset + gaps.length) % gaps.length]?.type;
      const right = gaps[(anchor + offset) % gaps.length]?.type;
      if (left !== right) break;
      matched += 1;
    }
  }
  return {
    word: gaps.map((gap) => gap.type).join(""),
    palette,
    symmetry: {
      anchor,
      matched,
      total: Math.max(0, Math.floor((gaps.length - 1) / 2)),
    },
  };
}

function lattice(alpha: number): LatticeVector[] {
  const vectors: LatticeVector[] = [];
  for (let x = -4; x <= 4; x += 1) {
    for (let y = -4; y <= 4; y += 1) {
      if (x === 0 && y === 0) continue;
      const projectedX = x + y * alpha;
      const projectedY = y;
      vectors.push({
        x: projectedX,
        y: projectedY,
        norm: Math.hypot(projectedX, projectedY),
        active: false,
      });
    }
  }
  const min = Math.min(...vectors.map((vector) => vector.norm));
  return vectors.map((vector) => ({
    ...vector,
    active: vector.norm < min * 1.45,
  }));
}

function extension(
  alpha: number,
  beta: number,
  size: number,
): { points: number[]; distinctCount: number; groups: GapGroup[] } {
  const points: number[] = [];
  for (let i = 0; i < size; i += 1) {
    for (let j = 0; j < 3; j += 1) points.push(frac(i * alpha + j * beta));
  }
  const sorted = sortNumbers(points);
  const gaps = sorted.map((value, index) => {
    const next = sorted[(index + 1) % sorted.length];
    return {
      id: "ext-" + index,
      start: value,
      end: next,
      length: index === sorted.length - 1 ? 1 - value + next : next - value,
      type: "",
      rank: index,
    };
  });
  const groups = gapGroups(gaps);
  return { points: sorted, distinctCount: groups.length, groups };
}

export function computeCertificate(
  input: Partial<Scenario>,
  topologyThreshold?: number,
): Certificate {
  const scenario = normalizeScenario(input);
  const points = allocatorValues(scenario);
  const sortedPoints = [...points].sort((a, b) => a.value - b.value);
  const gaps = gapsFromSorted(points);
  const groups = gapGroups(gaps);
  const lengths = groups.map((group) => group.length);
  const residual =
    lengths.length === 3 ? Math.abs(lengths[2] - lengths[1] - lengths[0]) : 0;
  const relation =
    lengths.length === 3
      ? lengths[2].toFixed(6) +
        " = " +
        lengths[1].toFixed(6) +
        " + " +
        lengths[0].toFixed(6)
      : "not needed in a two-gap state";
  const sumCheck = {
    holds: lengths.length < 3 || residual < 1e-7,
    residual,
    relation,
  };
  const contrast = scenario.allocator !== "rotation";
  const collision =
    new Set(points.map((point) => point.value.toFixed(10))).size !==
    points.length;
  const theoremStatus = contrast
    ? "contrast"
    : scenario.alphaMode === "rational" || collision
      ? "boundary"
      : sumCheck.holds
        ? "certified"
        : "warning";
  const theoremMessage = contrast
    ? "Contrast process: the allocator is not an arithmetic rotation."
    : scenario.alphaMode === "rational" || collision
      ? "Boundary case: rational or collision-prone input. The irrational theorem is not asserted."
      : theoremStatus === "certified"
        ? "Certificate agrees: at most three gaps, with additive largest gap when three occur."
        : "Diagnostic warning: direct and structural checks need attention.";
  const threshold =
    topologyThreshold ?? Math.max(...gaps.map((gap) => gap.length)) * 0.55;
  return {
    scenario,
    points,
    sortedPoints,
    gaps,
    groups,
    distinctCount: groups.length,
    sumCheck,
    theoremStatus,
    theoremMessage,
    lineage: incrementalLineage(points),
    farey: fareyPrediction(scenario.alpha, scenario.pointCount),
    continuedFraction: continuedFraction(scenario.alpha),
    dual: dualResult(scenario),
    topology: topology(gaps, threshold),
    word: word(gaps, groups),
    lattice: lattice(scenario.alpha),
    extension: extension(
      scenario.alpha,
      scenario.beta,
      Math.min(18, scenario.pointCount),
    ),
  };
}

export function polar(
  value: number,
  radius: number,
  center: number,
): [number, number] {
  const angle = value * TAU - Math.PI / 2;
  return [center + Math.cos(angle) * radius, center + Math.sin(angle) * radius];
}

export function starDiscrepancy(values: OrbitPoint[] | number[]): number {
  const sorted = values
    .map((value) =>
      typeof value === "number" ? frac(value) : frac(value.value),
    )
    .sort((a, b) => a - b);
  if (!sorted.length) return 0;
  return sorted.reduce((maximum, value, index) => {
    const upper = Math.abs((index + 1) / sorted.length - value);
    const lower = Math.abs(value - index / sorted.length);
    return Math.max(maximum, upper, lower);
  }, 0);
}

export function gapCountHistory(
  scenario: Scenario,
  limit = scenario.pointCount,
): Array<{ n: number; count: number }> {
  const bounded = Math.max(3, Math.min(limit, scenario.pointCount));
  return Array.from({ length: bounded - 2 }, (_, index) => {
    const n = index + 3;
    return {
      n,
      count: computeCertificate({ ...scenario, pointCount: n }).distinctCount,
    };
  });
}
