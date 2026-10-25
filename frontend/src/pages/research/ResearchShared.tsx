import { Callout, Equation, Refs, useShellLang } from "@fasl-work/caos-app-shell";
import { ScientificFigure, type ScientificFigureKind } from "../ScientificFigures";

export type Copy = { en: string; es: string };

export function useT() {
  const es = useShellLang() === "es";
  return (copy: Copy) => (es ? copy.es : copy.en);
}

export function PageHead({ title, lede }: { title: Copy; lede: Copy }) {
  const t = useT();
  return (
    <div className="page-head">
      <span className="eyebrow">GAPTHEO · THREE-GAP THEOREM</span>
      <h1>{t(title)}</h1>
      <p className="lede">{t(lede)}</p>
    </div>
  );
}

export type ResearchFigureKind =
  | "orbit"
  | "farey"
  | "dual"
  | "topology"
  | "pipeline"
  | "matrix";

const RESEARCH_FIGURE_MAP: Record<ResearchFigureKind, ScientificFigureKind> = {
  orbit: "overview",
  farey: "farey",
  dual: "returns",
  topology: "topology",
  pipeline: "pipeline",
  matrix: "benchmark",
};

const METHOD_DEPTH: Record<
  ResearchFigureKind,
  { paragraphs: Copy[]; equation: string; caption: Copy }
> = {
  orbit: {
    paragraphs: [
      {
        en: "The implementation preserves the ungrouped gaps before applying any numerical equivalence relation. This makes closure, non-negativity, wrap handling, and duplicate-point behaviour independently inspectable. Stable identifiers connect each rendered arc to its raw length, grouped class, lineage event, and later topology merge.",
        es: "La implementación conserva las brechas sin agrupar antes de aplicar equivalencia numérica. Esto permite inspeccionar por separado cierre, no negatividad, cierre circular y duplicados. Identificadores estables conectan cada arco con longitud cruda, clase, genealogía y fusión topológica.",
      },
      {
        en: "Use the circle and sorted-interval readings together: the circle preserves cyclic adjacency, while the interval makes order and the mandatory wrap explicit. A discrepancy between them is treated as a release-blocking implementation defect, not a visual approximation.",
        es: "Use juntas las lecturas circular e intervalar: el círculo preserva adyacencia cíclica y el intervalo hace explícitos el orden y el cierre. Una discrepancia se trata como defecto de implementación que bloquea el release, no como aproximación visual.",
      },
    ],
    equation: "\\rho_{sum}=\\left|1-\\sum_i g_i\\right|",
    caption: { en: "Independent partition-closure residual, evaluated before grouping.", es: "Residuo independiente de cierre, evaluado antes de agrupar." },
  },
  farey: {
    paragraphs: [
      {
        en: "The rational skeleton is computed with integer numerators and denominators; the decimal angle appears only as a cursor within that skeleton. This prevents a rounded display value from becoming the source of the Farey relation and keeps determinant and denominator checks exact.",
        es: "El esqueleto racional se calcula con numeradores y denominadores enteros; el ángulo decimal aparece solo como cursor. Así, un valor redondeado no se convierte en fuente de la relación de Farey y las verificaciones permanecen exactas.",
      },
      {
        en: "The active cell predicts finite combinatorial structure, but the direct orbit remains the numerical oracle. Candidate lengths and multiplicities are matched explicitly, and the maximum residual remains visible instead of being hidden by diagram geometry.",
        es: "La celda activa predice estructura combinatoria finita, pero la órbita directa sigue siendo el oráculo. Longitudes y multiplicidades se emparejan explícitamente y el residuo máximo permanece visible.",
      },
    ],
    equation: "\\rho_{Farey}=\\max_j|g_j^{direct}-g_j^{predicted}|",
    caption: { en: "Cross-description residual after matching predicted and direct classes.", es: "Residuo entre descripciones tras emparejar clases predichas y directas." },
  },
  dual: {
    paragraphs: [
      {
        en: "The selected visit indices are retained as evidence before differences are formed. Hovering or selecting a return jump can therefore identify both endpoint visits on the circle, the integer duration, and the target-interval convention that admitted them.",
        es: "Los índices de visita seleccionados se conservan antes de formar diferencias. Así, un salto puede identificar ambas visitas en el círculo, la duración entera y la convención del intervalo que las admitió.",
      },
      {
        en: "Changing beta recomputes membership and the complete return word; it does not stretch a previously drawn histogram. Primal lengths and dual return times retain different units and are displayed side by side only for comparison, never merged into one inventory.",
        es: "Cambiar beta recalcula pertenencia y la palabra completa; no estira un histograma previo. Longitudes primales y retornos duales conservan unidades distintas y se comparan sin fusionarse en un solo inventario.",
      },
    ],
    equation: "D_R=\\#\\{n_{j+1}-n_j\\}",
    caption: { en: "Distinct integer return-gap count, separate from the geometric D_N.", es: "Cantidad de retornos enteros distintos, separada del D_N geométrico." },
  },
  topology: {
    paragraphs: [
      {
        en: "The filtration is assembled from observed circular distances rather than from a decorative barcode. Every death threshold points back to one or more stable gap identifiers, so moving the threshold highlights the corresponding arcs and updates the component count.",
        es: "La filtración se construye desde distancias circulares observadas y no desde un código decorativo. Cada umbral apunta a brechas estables, por lo que moverlo resalta arcos y actualiza la cantidad de componentes.",
      },
      {
        en: "Only zero-dimensional connectivity is claimed. The app does not compute higher-dimensional persistence, stability bounds, or sliding-window embeddings; those belong to the cited research and are named as external extensions rather than implied capabilities.",
        es: "Solo se afirma conectividad de dimensión cero. La app no calcula persistencia superior, cotas de estabilidad ni embeddings de ventanas; pertenecen a la investigación citada y se nombran como extensiones externas.",
      },
    ],
    equation: "r_{death}\\in\\{g_0,\\ldots,g_{N-1}\\}",
    caption: { en: "Every finite H0 death threshold is traceable to an observed circular gap.", es: "Cada umbral de muerte H0 finito se rastrea a una brecha circular observada." },
  },
  pipeline: {
    paragraphs: [
      {
        en: "Each stage has one input and output responsibility, writes only beneath the requested output root, and records method-version metadata. Tests use a temporary root; only an explicit local bake updates canonical artifacts. This keeps validation and deployment read-only with respect to scientific truth.",
        es: "Cada etapa tiene una responsabilidad de entrada y salida, escribe solo bajo la raíz solicitada y registra versión del método. Las pruebas usan una raíz temporal; solo un horneado local explícito actualiza artefactos. La validación y el despliegue permanecen de solo lectura respecto de la verdad científica.",
      },
      {
        en: "The browser engine and Python reference are compared through normalized contract fields and residual tolerances, not through screenshot similarity. Scenario identity, conventions, backend, and hashes remain attached so a replay can be distinguished from a fresh live computation.",
        es: "El motor del navegador y la referencia Python se comparan mediante campos normalizados y tolerancias, no por similitud de capturas. Identidad, convenciones, backend y hashes permanecen adjuntos para distinguir reproducción de cálculo en vivo.",
      },
    ],
    equation: "h=\\operatorname{SHA256}(\\operatorname{canonicalJSON}(C))",
    caption: { en: "Canonical certificate digest recorded by the export and validation stages.", es: "Hash canónico del certificado registrado por exportación y validación." },
  },
  matrix: {
    paragraphs: [
      {
        en: "Every displayed benchmark value is projected from a committed certificate, and every certificate is indexed by path, byte size, method version, and SHA-256. The page does not carry hand-entered performance claims or a separate hidden table.",
        es: "Cada valor del benchmark se proyecta desde un certificado versionado, indexado por ruta, tamaño, versión y SHA-256. La página no contiene afirmaciones escritas manualmente ni una tabla oculta separada.",
      },
      {
        en: "Partition closure, theorem status, the additive relation, return-gap inventory, discrepancy, and integrity remain separate verdict channels. They are never averaged into a combined score that could hide a scientifically important failure.",
        es: "Cierre, estado teórico, relación aditiva, inventario de retornos, discrepancia e integridad permanecen como canales separados. Nunca se promedian en un puntaje que oculte una falla importante.",
      },
    ],
    equation: "\\mathcal V(C)=(v_{partition},v_{3gap},v_{dual},v_{hash})",
    caption: { en: "Layered verdict vector; no weighted aggregate is defined.", es: "Vector de veredictos por capas; no se define agregado ponderado." },
  },
};

export function MethodFigure({ kind }: { kind: ResearchFigureKind }) {
  return <ScientificFigure kind={RESEARCH_FIGURE_MAP[kind]} />;
}

export function MethodBlock({
  title,
  paragraphs,
  equation,
  caption,
  figure,
  visual,
  refs,
  boundary,
}: {
  title: Copy;
  paragraphs: Copy[];
  equation: string;
  caption: Copy;
  figure: Parameters<typeof MethodFigure>[0]["kind"];
  visual?: ScientificFigureKind;
  refs: string[];
  boundary: Copy;
}) {
  const t = useT();
  const depth = METHOD_DEPTH[figure];
  return (
    <section className="method-block">
      <h2>{t(title)}</h2>
      {paragraphs.map((p, index) => (
        <p key={index}>{t(p)}</p>
      ))}
      {depth.paragraphs.map((p, index) => (
        <p key={`depth-${index}`}>{t(p)}</p>
      ))}
      <Equation tex={equation} caption={t(caption)} />
      <Equation tex={depth.equation} caption={t(depth.caption)} />
      {visual ? <ScientificFigure kind={visual} /> : <MethodFigure kind={figure} />}
      <Callout
        variant="honest"
        title={t({ en: "Validity boundary", es: "Límite de validez" })}
      >
        <span>{t(boundary)}</span>
      </Callout>
      <Refs ids={refs} label={t({ en: "Sources", es: "Fuentes" })} />
    </section>
  );
}
