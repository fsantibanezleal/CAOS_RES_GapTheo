// The architecture modal (ADR-0058): five tabs, each an inline SVG (imported with ?raw, so it reads the page's
// theme tokens) that carries both languages, and a body in both languages. The shell validates this on mount: at
// least five tabs, inline SVG only, only defined tokens, no hex colours, both languages.
import type { ArchitectureConfig } from '@fasl-work/caos-app-shell';
import app from './01-the-app.svg?raw';
import lanes from './02-lanes.svg?raw';
import flow from './03-web-flow.svg?raw';
import science from './04-the-science.svg?raw';
import contracts from './05-data-contracts.svg?raw';

export const architecture: ArchitectureConfig = {
  tabs: [
    {
      id: 'app',
      en: 'The app',
      es: 'La app',
      svg: app,
      body_en:
        'The workbench keeps one selected rotation scenario synchronized across the circle, sorted interval, Farey and continued-fraction certificate, return-time word, and finite topology views. Angle step, phase, point count, target interval, allocator, seed, and tolerance are explicit inputs.',
      body_es:
        'El banco mantiene un escenario de rotación seleccionado sincronizado entre círculo, intervalo ordenado, certificado de Farey y fracciones continuas, palabra de retornos y topología finita. Paso angular, fase, cantidad de puntos, intervalo objetivo, asignador, semilla y tolerancia son entradas explícitas.',
    },
    {
      id: 'lanes',
      en: 'Lanes',
      es: 'Carriles',
      svg: lanes,
      body_en:
        'Offline, the Python pipeline computes deterministic finite certificates and checks orbit closure, gap classes, Farey predictions, and hashes. The browser workbench recomputes the selected finite orbit when controls change; seeded allocator controls are clearly labelled as comparisons outside the classical theorem.',
      body_es:
        'Fuera de línea, el pipeline en Python calcula certificados finitos deterministas y comprueba cierre orbital, clases de brecha, predicciones de Farey y hashes. El banco de trabajo del navegador recalcula la órbita finita seleccionada al cambiar los controles; los asignadores con semilla se identifican como contrastes fuera del teorema clásico.',
    },
    {
      id: 'flow',
      en: 'Web flow',
      es: 'Flujo web',
      svg: flow,
      body_en:
        'Versioned scenarios define alpha, phase, N, beta, the allocator, and seed. Each certificate retains raw orbit points, circular gaps, multiplicities, arithmetic predictions, residuals, and theorem applicability so every visualization can be traced to the same input.',
      body_es:
        'Los escenarios versionados definen alfa, fase, N, beta, asignador y semilla. Cada certificado conserva puntos de órbita, brechas circulares, multiplicidades, predicciones aritméticas, residuos y alcance del teorema para rastrear cada vista hasta la misma entrada.',
    },
    {
      id: 'science',
      en: 'The science',
      es: 'La ciencia',
      svg: science,
      body_en:
        'For irrational alpha, the first N orbit points partition the unit circle into at most three distinct arc lengths; when three occur, the largest is the sum of the other two. Direct sorting is the finite oracle, while the Farey and continued-fraction description supplies a separately computed arithmetic certificate.',
      body_es:
        'Para una alfa irracional, los primeros N puntos de la órbita particionan el círculo unitario en un máximo de tres longitudes de arco distintas. Si aparecen tres, la mayor es la suma de las otras dos. La órbita ordenada directa es el oráculo finito; Farey y fracciones continuas aportan un certificado aritmético calculado por separado.',
    },
    {
      id: 'contracts',
      en: 'Data contracts',
      es: 'Contratos de datos',
      svg: contracts,
      body_en:
        'Scenario inputs and computed certificates have versioned schemas. Producers validate before writing; consumers validate before rendering. A finite decimal is never treated as proof of irrationality, and rational or non-rotation controls carry explicit theorem-inapplicable status.',
      body_es:
        'Los escenarios de entrada y los certificados calculados usan esquemas versionados. Los productores validan antes de escribir y los consumidores antes de mostrar. Un decimal finito nunca se trata como prueba de irracionalidad; los controles racionales o que no son rotaciones declaran que el teorema no aplica.',
    },
  ],
};
