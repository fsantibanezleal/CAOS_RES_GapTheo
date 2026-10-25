// The shell owns the Introduction Landing, `/app` workbench route and tab order,
// and legacy App links preserve their query string and hash (WB-008).
import { APP_ROUTE, LANDING_ROUTE, STANDARD_ROUTES } from '@fasl-work/caos-app-shell';
import { readFileSync } from 'node:fs';
import { Writable } from 'node:stream';
import { renderToPipeableStream } from 'react-dom/server';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';
import { App } from './App';

const html = (path: string) => new Promise<string>((resolve, reject) => {
  let output = '';
  let settled = false;
  let timeout: ReturnType<typeof setTimeout>;
  const destination = new Writable({
    write(chunk, _encoding, callback) {
      output += chunk.toString();
      callback();
    },
  });
  const finish = (error?: unknown) => {
    if (settled) return;
    settled = true;
    clearTimeout(timeout);
    if (error) reject(error);
    else resolve(output);
  };
  destination.on('finish', () => finish());
  const stream = renderToPipeableStream(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
    {
      onAllReady: () => stream.pipe(destination),
      onShellError: finish,
      onError: finish,
    },
  );
  timeout = setTimeout(() => {
    stream.abort();
    finish(new Error(`Timed out rendering ${path} with its lazy route modules`));
  }, 10_000);
});

const source = readFileSync(new URL('./App.tsx', import.meta.url), 'utf8');

describe('the landing', () => {
  it('the routes are the standard ones, the App first and at /app, the landing on the Introduction', () => {
    expect(LANDING_ROUTE).toBe('/introduction');
    expect(APP_ROUTE).toBe('/app');
    expect(STANDARD_ROUTES.map((r) => r.path)).toEqual(['/app', '/introduction', '/methodology', '/implementation', '/experiments', '/benchmark']);
  });

  it('the example header lists the six routes in the decided order, the App leftmost', async () => {
    const page = await html('/introduction');
    const order = ['/app', '/introduction', '/methodology', '/implementation', '/experiments', '/benchmark'];
    const hrefs = [...page.matchAll(/<a [^>]*href="(\/[a-z]*)(?:[?#][^"]*)?"/g)].map((m) => m[1]);
    const seen = order.map((p) => hrefs.indexOf(p));
    expect(seen.every((i) => i >= 0)).toBe(true);
    expect([...seen].sort((a, b) => a - b)).toEqual(seen);
  });

  it('the Introduction opens on the sourced overview and provides the technical chapters second', async () => {
    const page = await html('/introduction');
    expect(page).toContain('data-executive-view');
    expect(page).toContain('data-executive-valid="true"');
    expect(page).toContain('Technical introduction');
  });

  it('the App route renders the workbench and not the executive view', async () => {
    const page = await html('/app');
    expect(page).not.toContain('data-executive-view');
    expect(page).toContain('data-surface');
  });

  it('adversarial: the root and unknown paths use the shell Landing and the App opens the workbench', () => {
    expect(source).toMatch(/<Route path="\/" element=\{<Landing \/>\} \/>/);
    expect(source).toMatch(/<Route path="\/app" element=\{<Workbench \/>\} \/>/);
    expect(source).toMatch(/<Route path="\*" element=\{<Landing \/>\} \/>/);
  });

  it('adversarial: each shell route is loaded through its own lazy module and a bilingual Suspense status', () => {
    const routes = [
      "const Workbench = lazy(() => import('./workbench/Workbench')",
      "const Introduction = lazy(() => import('./pages/Introduction')",
      "const Methodology = lazy(() => import('./pages/MethodologyPage')",
      "const Implementation = lazy(() => import('./pages/ImplementationPage')",
      "const Experiments = lazy(() => import('./pages/ExperimentsPage')",
      "const Benchmark = lazy(() => import('./pages/BenchmarkPage')",
    ];
    for (const route of routes) expect(source).toContain(route);
    expect(source).toContain('<Suspense fallback=');
    expect(source).toContain('aria-label="Loading / Cargando"');
    expect(source).not.toContain("from './pages/ResearchPages'");
    const introduction = readFileSync(new URL('./pages/Introduction.tsx', import.meta.url), 'utf8');
    expect(introduction).toContain('const TechnicalIntroduction = lazy(() => import("./IntroductionPage")');
  });

  it('adversarial: the Introduction-first order of shell 0.13.0 is refused, the landing does not move the tabs', () => {
    expect(STANDARD_ROUTES[0].path).not.toBe(LANDING_ROUTE);
    expect(STANDARD_ROUTES[0].path).toBe(APP_ROUTE);
    expect(STANDARD_ROUTES.map((r) => r.path).indexOf(LANDING_ROUTE)).toBe(1);
  });

  it('the App route opens Focus mode: the workbench sets focus, and the rail head carries the Focus control (WB-014)', async () => {
    const workbench = readFileSync(new URL('./workbench/Workbench.tsx', import.meta.url), 'utf8');
    expect(workbench).toMatch(/<GapTheoWorkbench\s*\/>/);
    expect(readFileSync(new URL('./workbench/GapTheoWorkbench.tsx', import.meta.url), 'utf8')).toMatch(/<SurfacePage[\s\S]*?\bfocus\b/);
    expect(await html('/app')).toContain('data-focus-enter');
  });

  it('adversarial: the root alone does not render the workbench', async () => {
    expect(await html('/')).not.toContain('data-workbench');
    expect(await html('/nowhere')).not.toContain('data-workbench');
  });
});
