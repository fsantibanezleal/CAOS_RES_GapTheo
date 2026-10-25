// The six routes on the shared shell (ADR-0016, ADR-0057 as amended 2026-10-04): the App route (/app) is the workbench,
// the five documentation routes are DocPages. The product lands on the mathematical introduction: the root and every unknown path render <Landing />, which opens /introduction and forwards
// an old App link such as /?case=B2 to /app?case=B2. The header order is the shell's STANDARD_ROUTES: App, Introduction,
// Methodology, Implementation, Experiments, Benchmark; the landing never moves the tabs. Identity, licence and visibility come from product.json (one source,
// declared in product.json); the version is VERSION, injected at build.
import { AppShell, CitationsProvider, Landing, STANDARD_ROUTES, type ShellConfig } from '@fasl-work/caos-app-shell';
import { Route, Routes } from 'react-router';
import product from '../../product.json';
import { CITATIONS } from './content/citations';
import {
  BenchmarkPage as Benchmark,
  ExperimentsPage as Experiments,
  ImplementationPage as Implementation,
  MethodologyPage as Methodology,
} from './pages/ResearchPages';
// Resolve the product-specific, inline architecture diagrams.
import { architecture } from './architecture/index';
import { Introduction } from './pages/Introduction';
import { Workbench } from './workbench/Workbench';

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
      </AppShell>
    </CitationsProvider>
  );
}
