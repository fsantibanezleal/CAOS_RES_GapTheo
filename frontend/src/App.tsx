// The root and unknown paths use the shared shell Landing, which opens the Introduction and preserves legacy App deep links.
// The workbench lives at /app, followed by the five documentation routes. The header order is the shell's STANDARD_ROUTES:
// App, Introduction, Methodology, Implementation, Experiments, Benchmark. Identity, licence and visibility come from product.json (one source,
// declared in product.json); the version is VERSION, injected at build.
import { lazy, Suspense } from 'react';
import { AppShell, CitationsProvider, Landing, STANDARD_ROUTES, type ShellConfig } from '@fasl-work/caos-app-shell';
import { Route, Routes } from 'react-router';
import product from '../../product.json';
import { CITATIONS } from './content/citations';
// Resolve the product-specific, inline architecture diagrams.
import { architecture } from './architecture/index';

// Keep the shared frame in the initial entry; load each route's research and instrument code on demand.
const Benchmark = lazy(() => import('./pages/BenchmarkPage').then((module) => ({ default: module.BenchmarkPage })));
const Experiments = lazy(() => import('./pages/ExperimentsPage').then((module) => ({ default: module.ExperimentsPage })));
const Implementation = lazy(() => import('./pages/ImplementationPage').then((module) => ({ default: module.ImplementationPage })));
const Introduction = lazy(() => import('./pages/Introduction').then((module) => ({ default: module.Introduction })));
const Methodology = lazy(() => import('./pages/MethodologyPage').then((module) => ({ default: module.MethodologyPage })));
const Workbench = lazy(() => import('./workbench/Workbench').then((module) => ({ default: module.Workbench })));

const config: ShellConfig = {
  product: { name: product.name },
  routes: STANDARD_ROUTES,
  links: { github: product.repo },
  version: __APP_VERSION__,
  build: __BUILD_ID__,
  license: { en: "Apache License 2", es: "Licencia Apache, versión 2" },
  visibility: product.visibility === 'private' ? 'private' : 'public',
  contain: true,
  architecture,
};

export function App() {
  return (
    <CitationsProvider items={CITATIONS}>
      <AppShell config={config}>
        <Suspense fallback={<p className="caos-pending" data-state="loading" role="status" aria-label="Loading / Cargando">…</p>}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/app" element={<Workbench />} />
            <Route path="/introduction" element={<Introduction />} />
            <Route path="/methodology" element={<Methodology />} />
            <Route path="/implementation" element={<Implementation />} />
            <Route path="/experiments" element={<Experiments />} />
            <Route path="/benchmark" element={<Benchmark />} />
            <Route path="*" element={<Landing />} />
          </Routes>
        </Suspense>
      </AppShell>
    </CitationsProvider>
  );
}
