export type BundleFile = Readonly<{ name: string; bytes: number }>;
export const MAX_BUNDLE_BYTES: number;
export function bundleBudgetFindings(files: readonly BundleFile[], maxBytes?: number): string[];
