import {
  Callout,
  Equation,
  InlineMath,
  Refs,
  SubTabs,
  Tabs,
  useShellLang,
} from "@fasl-work/caos-app-shell";
import benchmark from "../data/benchmark.json";
import {
  ScientificFigure,
  type ScientificFigureKind,
} from "./ScientificFigures";

const CATEGORY_ES: Record<string, string> = {
  "Irrational rotations": "Rotaciones irracionales",
  "Transcendental rotations": "Rotaciones trascendentes",
  "Phase and finite size": "Fase y tamaño finito",
  "Numerical conditioning": "Condicionamiento numérico",
  "Rational boundaries": "Fronteras racionales",
  "Process contrasts": "Contrastes de proceso",
};

type Copy = { en: string; es: string };

function useT() {
  const es = useShellLang() === "es";
  return (copy: Copy) => (es ? copy.es : copy.en);
}

function PageHead({ title, lede }: { title: Copy; lede: Copy }) {
  const t = useT();
  return (
    <div className="page-head">
      <span className="eyebrow">GAPTHEO · RESEARCH ATLAS</span>
      <h1>{t(title)}</h1>
      <p className="lede">{t(lede)}</p>
    </div>
  );
}

type ResearchFigureKind =
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

function MethodFigure({ kind }: { kind: ResearchFigureKind }) {
  return <ScientificFigure kind={RESEARCH_FIGURE_MAP[kind]} />;
}

function MethodBlock({
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

export function IntroductionPage() {
  const t = useT();
  const tabs = [
    {
      id: "problem",
      label: t({ en: "Problem", es: "Problema" }),
      content: (
        <section className="research-chapter">
          <span className="eyebrow">{t({ en: "WHAT IS MEASURED?", es: "¿QUÉ SE MIDE?" })}</span>
          <h2>{t({ en: "A finite orbit cuts the unit circle", es: "Una órbita finita corta el círculo unitario" })}</h2>
          <p>{t({ en: "Choose an angle step alpha, a phase phi, and a finite point count N. GapTheo evaluates x_n = {phi + n alpha} for n from zero through N-1, sorts those positions, and measures every adjacent circular arc, including the wrap from the last sorted point back to the first. The theorem concerns the number of distinct arc lengths, not the number of arcs and not Euclidean chord lengths.", es: "Elija un paso angular alfa, una fase phi y una cantidad finita N. GapTheo evalúa x_n = {phi + n alfa} para n entre cero y N-1, ordena esas posiciones y mide cada arco circular adyacente, incluido el cierre desde el último punto al primero. El teorema trata la cantidad de longitudes de arco distintas, no la cantidad de arcos ni las cuerdas euclidianas." })}</p>
          <p>{t({ en: "For an irrational rotation, the finite partition has at most three distinct lengths. When all three occur, the largest is the sum of the two smaller lengths. GapTheo keeps the unconditional closure invariant separate from that theorem certificate: every allocator must form a valid partition, but only a declared irrational one-frequency rotation enters the classical theorem regime.", es: "Para una rotación irracional, la partición finita tiene como máximo tres longitudes distintas. Cuando aparecen las tres, la mayor es la suma de las dos menores. GapTheo mantiene separado el invariante incondicional de cierre del certificado teórico: todo asignador debe formar una partición válida, pero solo una rotación irracional declarada de una frecuencia entra al régimen clásico." })}</p>
          <Equation tex={"x_n=\\{\\phi+n\\alpha\\},\\quad 0\\le n<N"} caption={t({ en: "Finite rotation orbit in turns; braces denote fractional part.", es: "Órbita finita en vueltas; las llaves denotan parte fraccionaria." })} />
          <Equation tex={"\\sum_{i=0}^{N-1}g_i=1,\\qquad D_N=\\#\\{g_i\\}\\le 3"} caption={t({ en: "Partition closure and the distinct-length bound are separate assertions.", es: "El cierre de la partición y la cota de longitudes son aserciones separadas." })} />
          <MethodFigure kind="orbit" />
          <Callout variant="honest" title={t({ en: "Hypothesis", es: "Hipótesis" })}><span>{t({ en: "A finite decimal does not certify irrationality. The scenario stores the mathematical declaration and the certificate reports numerical conditioning separately.", es: "Un decimal finito no certifica irracionalidad. El escenario almacena la declaración matemática y el certificado informa el condicionamiento por separado." })}</span></Callout>
          <Refs ids={["hamada2024", "alessandri1998"]} label={t({ en: "Sources", es: "Fuentes" })} />
        </section>
      ),
    },
    {
      id: "mechanism",
      label: t({ en: "Mechanism", es: "Mecanismo" }),
      content: (
        <section className="research-chapter">
          <span className="eyebrow">{t({ en: "HOW DOES N CHANGE THE STATE?", es: "¿CÓMO CAMBIA N EL ESTADO?" })}</span>
          <h2>{t({ en: "One insertion, one parent arc, two children", es: "Una inserción, un arco padre, dos hijos" })}</h2>
          <p>{t({ en: "Read the orbit in index order. A new non-colliding point lies inside exactly one existing empty arc. That parent gap disappears and two identified child gaps replace it, while all other gaps persist. The split conserves length. Stable point and gap identifiers let playback, circle selection, the cyclic word, and topology refer to the same event instead of presenting disconnected animations.", es: "Lea la órbita en orden de índices. Un punto nuevo sin colisión cae dentro de exactamente un arco vacío existente. Esa brecha padre desaparece y dos brechas hijas identificadas la reemplazan, mientras todas las demás persisten. La división conserva longitud. Identificadores estables permiten que reproducción, selección, palabra cíclica y topología se refieran al mismo evento." })}</p>
          <p>{t({ en: "At a rational collision there is no interior split. The engine records the duplicate residue and multiplicity instead of manufacturing zero-length children. This distinction matters because the genealogy is explanatory evidence built from the direct orbit; it must preserve the actual finite geometry even outside the theorem regime.", es: "En una colisión racional no hay división interior. El motor registra el residuo duplicado y su multiplicidad en vez de fabricar hijos de longitud cero. La distinción importa porque la genealogía es evidencia explicativa construida desde la órbita directa y debe preservar la geometría finita real aun fuera del régimen." })}</p>
          <Equation tex={"g_{parent}=g_{left}+g_{right}"} caption={t({ en: "Local conservation law for each non-colliding insertion.", es: "Ley de conservación local para cada inserción sin colisión." })} />
          <ScientificFigure kind="split" />
          <Callout variant="honest" title={t({ en: "Interpretation", es: "Interpretación" })}><span>{t({ en: "The lineage explains finite updates and supports implementation checks. It is not presented as a new proof of the theorem.", es: "La genealogía explica actualizaciones finitas y permite verificar la implementación. No se presenta como una prueba nueva del teorema." })}</span></Callout>
          <Refs ids={["alessandri1998", "hamada2024"]} label={t({ en: "Sources", es: "Fuentes" })} />
        </section>
      ),
    },
    {
      id: "readings",
      label: t({ en: "Linked readings", es: "Lecturas vinculadas" }),
      content: (
        <section className="research-chapter">
          <span className="eyebrow">{t({ en: "WHY MORE THAN ONE VIEW?", es: "¿POR QUÉ MÁS DE UNA VISTA?" })}</span>
          <h2>{t({ en: "One certificate, synchronized projections", es: "Un certificado, proyecciones sincronizadas" })}</h2>
          <p>{t({ en: "The circle exposes primary geometry but not the rational skeleton controlling event changes. Farey neighbours and continued fractions explain arithmetic scales; return times ask a dual question about visits to a target interval; cyclic words preserve class order; the lattice view packages Diophantine information geometrically; and finite H0 records observed gaps as merge thresholds. These are projections of one selected state, not decorative topics assembled on one page.", es: "El círculo expone la geometría primaria, pero no el esqueleto racional que controla los eventos. Farey y fracciones explican escalas aritméticas; los retornos formulan una pregunta dual; las palabras preservan el orden; el retículo empaqueta información diofántica; y H0 registra brechas como umbrales. Son proyecciones de un estado seleccionado, no temas decorativos reunidos en una página." })}</p>
          <p>{t({ en: "Changing alpha, N, phase, beta, allocator, or seed first creates a new immutable direct certificate. Every secondary panel consumes that state and exposes residuals when a predicted inventory disagrees. No panel owns a hidden scenario, so a visually plausible but stale view cannot silently survive a control change.", es: "Cambiar alfa, N, fase, beta, asignador o semilla crea primero un nuevo certificado directo inmutable. Cada panel secundario consume ese estado y expone residuos si un inventario predicho discrepa. Ningún panel conserva un escenario oculto, por lo que una vista plausible pero obsoleta no sobrevive silenciosamente a un control." })}</p>
          <Equation tex={"C=F(\\alpha,N,\\phi,\\beta,\\mathrm{allocator},\\mathrm{seed}),\\qquad V_j=\\pi_j(C)"} caption={t({ en: "Every reading is a named projection of one deterministic certificate.", es: "Cada lectura es una proyección nombrada de un certificado determinista." })} />
          <ScientificFigure kind="readings" />
          <Callout variant="honest" title={t({ en: "Evidence boundary", es: "Límite de evidencia" })}><span>{t({ en: "Cross-view agreement validates implementation consistency. Shared inputs mean the views are not automatically logically independent proofs.", es: "El acuerdo entre vistas valida consistencia de implementación. Entradas compartidas implican que las vistas no son pruebas lógicamente independientes." })}</span></Callout>
          <Refs ids={["berthe2024", "marklof2017", "taha2018", "suarez2026"]} label={t({ en: "Sources", es: "Fuentes" })} />
        </section>
      ),
    },
    {
      id: "notation",
      label: t({ en: "Notation", es: "Notación" }),
      content: (
        <section className="research-chapter">
          <span className="eyebrow">{t({ en: "BUILD CONVENTIONS", es: "CONVENCIONES DEL SISTEMA" })}</span>
          <h2>{t({ en: "Definitions that determine the finite object", es: "Definiciones que determinan el objeto finito" })}</h2>
          <p>{t({ en: "GapTheo counts N points indexed from zero to N-1 and measures normalized arc lengths in turns. The sorted orbit always includes the wrap gap. Numerical mode validates raw arcs before grouping them at a visible absolute tolerance. Rational mode evaluates modular integer residues before applying phase, preventing accumulated multiplication error. Return mode uses a displayed half-open target interval [0,beta).", es: "GapTheo cuenta N puntos indexados de cero a N-1 y mide arcos normalizados en vueltas. La órbita ordenada siempre incluye el cierre. El modo numérico valida arcos crudos antes de agruparlos con tolerancia absoluta visible. El modo racional evalúa residuos enteros modulares antes de aplicar fase. El modo de retornos usa un intervalo semiabierto [0,beta) mostrado." })}</p>
          <ul className="symbol-grid">
            <li><InlineMath tex="\\alpha" />: {t({ en: "angle step in turns", es: "paso angular en vueltas" })}</li>
            <li><InlineMath tex="N" />: {t({ en: "number of orbit points", es: "cantidad de puntos" })}</li>
            <li><InlineMath tex="\\phi" />: {t({ en: "phase offset", es: "desfase" })}</li>
            <li><InlineMath tex="\\beta" />: {t({ en: "target interval length", es: "longitud del intervalo" })}</li>
            <li><InlineMath tex="g_i" />: {t({ en: "sorted circular gap", es: "brecha circular ordenada" })}</li>
            <li><InlineMath tex="D_N" />: {t({ en: "distinct-length count", es: "cantidad de longitudes" })}</li>
            <li><InlineMath tex="p/q" />: {t({ en: "exact rational declaration", es: "declaración racional exacta" })}</li>
            <li><InlineMath tex="q_k" />: {t({ en: "convergent denominator", es: "denominador convergente" })}</li>
            <li><InlineMath tex="H_0" />: {t({ en: "connected-component homology", es: "homología de componentes" })}</li>
            <li><InlineMath tex="D_N^*" />: {t({ en: "star discrepancy", es: "discrepancia estrella" })}</li>
          </ul>
          <Equation tex={"g_i=x_{(i+1)}-x_{(i)},\\quad g_{N-1}=1+x_{(0)}-x_{(N-1)}"} caption={t({ en: "Interior gaps and the mandatory wrap gap.", es: "Brechas interiores y brecha de cierre obligatoria." })} />
          <ScientificFigure kind="overview" />
          <Callout variant="honest" title={t({ en: "Compare conventions first", es: "Compare primero las convenciones" })}><span>{t({ en: "Different papers may index N+1 points or use a different endpoint convention. A changed finite table is not automatically a mathematical contradiction.", es: "Distintos artículos pueden indexar N+1 puntos o usar otra convención de extremos. Una tabla finita distinta no implica contradicción matemática." })}</span></Callout>
          <Refs ids={["hamada2024", "mayero2006"]} label={t({ en: "Sources", es: "Fuentes" })} />
        </section>
      ),
    },
    {
      id: "scope",
      label: t({ en: "Scope", es: "Alcance" }),
      content: (
        <section className="research-chapter">
          <span className="eyebrow">{t({ en: "HONEST CLAIMS", es: "AFIRMACIONES HONESTAS" })}</span>
          <h2>{t({ en: "What this atlas establishes, and what it refuses to claim", es: "Qué establece este atlas y qué se niega a afirmar" })}</h2>
          <p>{t({ en: "The app establishes reproducible finite statements about implemented scenarios: orbit points, circular gaps, length classes, split events, rational approximants, return indices, finite topology thresholds, residuals, and content hashes. For declared irrational rotations it reports whether the computed finite partition satisfies the three-gap and additive relations. Committed artifacts make those statements replayable instead of anecdotal.", es: "La app establece afirmaciones finitas reproducibles sobre escenarios implementados: puntos, brechas, clases, divisiones, aproximantes, retornos, umbrales topológicos, residuos y hashes. Para rotaciones declaradas irracionales informa si la partición satisface las relaciones de tres brechas y aditividad. Los artefactos versionados vuelven reproducibles esas afirmaciones." })}</p>
          <p>{t({ en: "It does not prove irrationality from digits, replace a formal proof, establish a new theorem, transfer the bound to random or farthest-point processes, or implement general persistent homology. The defensible contribution is the synchronized certificate protocol: exact and numerical readings made inspectable under explicit validity boundaries.", es: "No prueba irracionalidad desde dígitos, no reemplaza una demostración formal, no establece un teorema nuevo, no transfiere el límite a procesos aleatorios o de punto más lejano ni implementa homología persistente general. La contribución defendible es el protocolo sincronizado de certificados bajo límites explícitos." })}</p>
          <Equation tex={"\\mathrm{computed\\ agreement}\\;\\not\\Rightarrow\\;\\mathrm{new\\ proof}"} caption={t({ en: "Reproducible computation and proof are deliberately not conflated.", es: "El cálculo reproducible y la prueba no se confunden deliberadamente." })} />
          <ScientificFigure kind="readings" />
          <Callout variant="honest" title={t({ en: "Novelty boundary", es: "Límite de novedad" })}><span>{t({ en: "Formal theorem novelty would require a separately reviewed proof artifact. This release claims a research workbench and reproducibility protocol.", es: "La novedad teórica exigiría un artefacto de prueba revisado por separado. Este release afirma un laboratorio y un protocolo de reproducibilidad." })}</span></Callout>
          <Refs ids={["mayero2006", "suarez2026", "haynes2014"]} label={t({ en: "Sources", es: "Fuentes" })} />
        </section>
      ),
    },
  ];
  return (
    <main className="page-body prose">
      <PageHead title={{ en: "Introduction", es: "Introducción" }} lede={{ en: "A rigorous map of the finite rotation problem: what is measured, how the partition evolves, why several mathematical readings are linked, which conventions determine the result, and which claims the application deliberately refuses to make.", es: "Un mapa riguroso del problema de rotación finita: qué se mide, cómo evoluciona la partición, por qué se vinculan varias lecturas, qué convenciones determinan el resultado y qué afirmaciones la aplicación se niega deliberadamente a hacer." }} />
      <Tabs tabs={tabs} ariaLabel={t({ en: "Introduction chapters", es: "Capítulos de introducción" })} />
    </main>
  );
}

export function MethodologyPage() {
  const t = useT();
  const tabs = [
    {
      id: "direct",
      label: t({ en: "Direct orbit", es: "Órbita directa" }),
      content: (
        <MethodBlock
          title={{
            en: "Direct sorted partition",
            es: "Partición ordenada directa",
          }}
          paragraphs={[
            {
              en: "The primary calculation evaluates the finite orbit, sorts its fractional parts, closes the circle, and groups numerically equal gaps with a documented tolerance. Rational inputs use integer residues before normalization, preventing accumulated multiplication error.",
              es: "El cálculo principal evalúa la órbita finita, ordena sus partes fraccionarias, cierra el círculo y agrupa brechas numéricamente iguales con una tolerancia documentada. Las entradas racionales usan residuos enteros antes de normalizar.",
            },
            {
              en: "The partition sum is checked independently of the theorem. That invariant detects missing wrap gaps, duplicate handling errors, and grouping drift even in contrast modes where the three-gap bound does not apply.",
              es: "La suma de la partición se verifica independientemente del teorema. Ese invariante detecta cierres faltantes, errores con duplicados y deriva de agrupación incluso en modos de contraste.",
            },
          ]}
          equation={"\\sum_{i=1}^{N}g_i=1"}
          caption={{
            en: "Every circular partition must close exactly.",
            es: "Toda partición circular debe cerrar exactamente.",
          }}
          figure="orbit"
          refs={["hamada2024"]}
          boundary={{
            en: "Certification requires the declared irrational rotation regime. The direct partition itself remains valid for every allocator.",
            es: "La certificación requiere el régimen declarado de rotación irracional. La partición directa sigue siendo válida para todo asignador.",
          }}
        />
      ),
    },
    {
      id: "genealogy",
      label: t({ en: "Genealogy", es: "Genealogía" }),
      content: (
        <MethodBlock
          title={{
            en: "Incremental gap splitting",
            es: "División incremental de brechas",
          }}
          paragraphs={[
            {
              en: "Insert orbit points in index order. Each non-colliding point lies inside one existing empty arc and replaces that parent by two child gaps. The resulting lineage explains why multiplicities change at discrete insertion events.",
              es: "Inserte puntos en orden de índice. Cada punto sin colisión cae dentro de un arco vacío existente y reemplaza ese padre por dos brechas hijas. La genealogía explica por qué las multiplicidades cambian en eventos discretos.",
            },
            {
              en: "Stable point and gap identifiers let playback, selection, topology, and word views refer to the same geometric objects. The lineage is explanatory evidence and does not replace the theorem proof.",
              es: "Identificadores estables permiten que reproducción, selección, topología y palabra se refieran a los mismos objetos geométricos. La genealogía es evidencia explicativa y no reemplaza la prueba.",
            },
          ]}
          equation={"g_{parent}=g_{left}+g_{right}"}
          caption={{
            en: "A non-colliding insertion conserves the parent arc length.",
            es: "Una inserción sin colisión conserva la longitud del arco padre.",
          }}
          figure="orbit"
          visual="split"
          refs={["alessandri1998"]}
          boundary={{
            en: "At a rational collision, no interior split occurs; the UI labels that event instead of inventing children.",
            es: "En una colisión racional no ocurre una división interior; la interfaz etiqueta el evento en vez de inventar hijas.",
          }}
        />
      ),
    },
    {
      id: "farey",
      label: "Farey",
      content: (
        <MethodBlock
          title={{
            en: "Farey parameter cells",
            es: "Celdas paramétricas de Farey",
          }}
          paragraphs={[
            {
              en: "At fixed N, neighboring reduced fractions bracket alpha and identify a cell in which the finite combinatorial type is stable. Crossing a Farey boundary changes the active denominators and therefore the candidate gap lengths and multiplicities.",
              es: "Con N fijo, fracciones reducidas vecinas acotan alfa e identifican una celda donde el tipo combinatorio finito es estable. Cruzar una frontera cambia denominadores activos, longitudes candidatas y multiplicidades.",
            },
            {
              en: "The atlas recomputes the bracket from integer numerators and denominators. It shows the current decimal cursor only as a location inside that exact rational skeleton.",
              es: "El atlas recalcula el intervalo con numeradores y denominadores enteros. Muestra el cursor decimal solo como ubicación dentro de ese esqueleto racional exacto.",
            },
          ]}
          equation={"\\frac{a}{b}<\\alpha<\\frac{c}{d},\\qquad bc-ad=1"}
          caption={{
            en: "Neighboring Farey fractions define the active cell.",
            es: "Fracciones vecinas de Farey definen la celda activa.",
          }}
          figure="farey"
          refs={["hamada2024"]}
          boundary={{
            en: "Near a boundary, floating-point location is conditioned by the distance to the rational endpoint; the app reports the declaration and residuals.",
            es: "Cerca de una frontera, la ubicación numérica depende de la distancia al extremo racional; la app informa declaración y residuos.",
          }}
        />
      ),
    },
    {
      id: "continued",
      label: t({ en: "Continued fractions", es: "Fracciones continuas" }),
      content: (
        <MethodBlock
          title={{
            en: "Convergents and event scales",
            es: "Convergentes y escalas de evento",
          }}
          paragraphs={[
            {
              en: "The continued fraction of alpha produces best rational approximants p_k/q_k. Their denominators organize the N values at which the partition changes form and explain why quadratic irrationals produce recurring visual patterns.",
              es: "La fracción continua de alfa produce mejores aproximantes p_k/q_k. Sus denominadores organizan los valores N donde cambia la partición y explican patrones recurrentes para irracionales cuadráticos.",
            },
            {
              en: "GapTheo derives terms and convergents with integer recurrences. The displayed error is a numerical reading of a mathematically exact recurrence, not a proof that a decimal is irrational.",
              es: "GapTheo deriva términos y convergentes con recurrencias enteras. El error mostrado es una lectura numérica de una recurrencia exacta, no una prueba de irracionalidad de un decimal.",
            },
          ]}
          equation={"p_k=a_kp_{k-1}+p_{k-2},\\quad q_k=a_kq_{k-1}+q_{k-2}"}
          caption={{
            en: "Integer recurrence for continued-fraction convergents.",
            es: "Recurrencia entera para convergentes.",
          }}
          figure="farey"
          visual="continued"
          refs={["alessandri1998", "berthe2024"]}
          boundary={{
            en: "Finite truncation explains the current orbit scale only; it does not classify the infinite expansion.",
            es: "El truncamiento finito explica solo la escala actual; no clasifica la expansión infinita.",
          }}
        />
      ),
    },
    {
      id: "dual",
      label: t({ en: "Return gaps", es: "Brechas de retorno" }),
      content: (
        <MethodBlock
          title={{
            en: "Dual target-interval returns",
            es: "Retornos duales a un intervalo",
          }}
          paragraphs={[
            {
              en: "Choose a target interval [0,beta) and retain the orbit indices that visit it. Consecutive selected indices define integer return gaps, a dual problem distinct from geometric adjacency on the circle.",
              es: "Elija un intervalo [0,beta) y conserve los índices que lo visitan. Índices seleccionados consecutivos definen brechas enteras de retorno, un problema dual distinto de la adyacencia geométrica.",
            },
            {
              en: "Endpoint convention matters when an orbit point lands exactly on beta. The scenario records strict or non-strict selection so the result can be reproduced.",
              es: "La convención del extremo importa cuando un punto cae exactamente en beta. El escenario registra selección estricta o no estricta para reproducir el resultado.",
            },
          ]}
          equation={"r_j=n_{j+1}-n_j,\\qquad \\{n_j\\alpha+\\phi\\}<\\beta"}
          caption={{
            en: "Return gaps are differences of visit indices.",
            es: "Las brechas de retorno son diferencias de índices de visita.",
          }}
          figure="dual"
          refs={["hamada2024", "alessandri1998"]}
          boundary={{
            en: "The dual inventory is not another list of primal geometric gaps; its units are indices.",
            es: "El inventario dual no es otra lista de brechas geométricas; sus unidades son índices.",
          }}
        />
      ),
    },
    {
      id: "topology",
      label: t({ en: "Topology", es: "Topología" }),
      content: (
        <MethodBlock
          title={{
            en: "Finite zero-dimensional Rips lens",
            es: "Lente de Rips finita en dimensión cero",
          }}
          paragraphs={[
            {
              en: "Increase a circular distance threshold r. Initially each sampled point is its own connected component. A nearest-neighbor gap creates a merge when r reaches that observed length, so the finite H0 barcode is traceable to the direct partition.",
              es: "Aumente un umbral circular r. Al inicio cada punto es un componente. Una brecha vecina crea una fusión cuando r alcanza esa longitud, por lo que el código H0 finito se rastrea a la partición directa.",
            },
            {
              en: "The view exposes component counts, death thresholds, and links to gap types. It deliberately stops at zero-dimensional connectivity and does not claim to compute a complete persistence module.",
              es: "La vista expone componentes, umbrales de muerte y vínculos a tipos de brecha. Se detiene deliberadamente en conectividad de dimensión cero y no afirma calcular un módulo completo.",
            },
          ]}
          equation={"\\beta_0(r)=\\#\\pi_0(\\mathrm{Rips}(X_N,r))"}
          caption={{
            en: "The component count decreases at observed gap thresholds.",
            es: "La cantidad de componentes disminuye en umbrales observados.",
          }}
          figure="topology"
          refs={["suarez2026"]}
          boundary={{
            en: "This is a finite H0 interpretation on the circle, not a general persistent-homology engine.",
            es: "Esta es una interpretación H0 finita en el círculo, no un motor general de homología persistente.",
          }}
        />
      ),
    },
  ];
  return (
    <main className="page-body prose">
      <PageHead
        title={{ en: "Methodology", es: "Metodología" }}
        lede={{
          en: "Six method families explain the same finite state from geometric, arithmetic, symbolic, dual, and topological directions. Each view names its units, exact computation, and validity boundary.",
          es: "Seis familias explican el mismo estado finito desde direcciones geométricas, aritméticas, simbólicas, duales y topológicas. Cada vista nombra sus unidades, cálculo exacto y límite de validez.",
        }}
      />
      <Tabs tabs={tabs} ariaLabel="methodology" />
    </main>
  );
}

export function ImplementationPage() {
  const t = useT();
  const engineTabs = [
    {
      id: "numeric",
      label: t({ en: "Numeric core", es: "Núcleo numérico" }),
      content: (
        <MethodBlock
          title={{
            en: "Live TypeScript engine",
            es: "Motor TypeScript en vivo",
          }}
          paragraphs={[
            {
              en: "The browser normalizes the selected scenario, computes stable orbit points, sorts the partition, groups lengths at tolerance 1e-8, and derives every linked reading from one immutable certificate object.",
              es: "El navegador normaliza el escenario, calcula puntos estables, ordena la partición, agrupa longitudes con tolerancia 1e-8 y deriva cada lectura desde un certificado inmutable.",
            },
            {
              en: "Rational mode uses modular integer residues (p n mod q)/q before the phase shift. Seeded random uses a deterministic 32-bit generator. Farthest-point mode bisects the lexicographically first largest empty arc.",
              es: "El modo racional usa residuos modulares enteros (p n mod q)/q antes de la fase. El aleatorio usa un generador determinista de 32 bits. El punto más lejano biseca el primer arco vacío máximo.",
            },
          ]}
          equation={"x_n=\\operatorname{frac}(\\phi+(pn\\bmod q)/q)"}
          caption={{
            en: "Exact residue path for rational mode.",
            es: "Ruta de residuos exactos para modo racional.",
          }}
          figure="pipeline"
          refs={["hamada2024"]}
          boundary={{
            en: "Floating-point grouping is visible and versioned; it is not arbitrary-precision arithmetic.",
            es: "La agrupación de punto flotante es visible y versionada; no es aritmética de precisión arbitraria.",
          }}
        />
      ),
    },
    {
      id: "reference",
      label: t({ en: "Reference pipeline", es: "Pipeline de referencia" }),
      content: (
        <MethodBlock
          title={{ en: "Named Python stages", es: "Etapas Python nombradas" }}
          paragraphs={[
            {
              en: "The offline pipeline separates ingestion, normalization, regime partitioning, feature calculation, method registration, inference, evaluation, export, and validation. A smoke run writes to a temporary root, while the intentional canonical bake updates the versioned artifacts.",
              es: "El pipeline offline separa ingesta, normalización, partición de regímenes, cálculo, registro de métodos, inferencia, evaluación, exportación y validación. La prueba escribe en un directorio temporal y el bake intencional actualiza artefactos versionados.",
            },
            {
              en: "There is no statistical training stage because the product evaluates exact and numerical mathematical methods. The registry records that non-applicability rather than inventing a model or checkpoint.",
              es: "No hay entrenamiento estadístico porque el producto evalúa métodos matemáticos exactos y numéricos. El registro documenta esa no aplicabilidad en vez de inventar un modelo.",
            },
          ]}
          equation={
            "\\operatorname{artifact}=F(\\operatorname{scenario},\\operatorname{version})"
          }
          caption={{
            en: "The canonical bake is deterministic for a fixed version.",
            es: "El bake canónico es determinista para una versión fija.",
          }}
          figure="pipeline"
          refs={["mayero2006"]}
          boundary={{
            en: "Deployment validates committed artifacts and never performs the canonical bake.",
            es: "El despliegue valida artefactos versionados y nunca ejecuta el bake canónico.",
          }}
        />
      ),
    },
  ];
  const tabs = [
    {
      id: "lanes",
      label: t({ en: "Lanes", es: "Carriles" }),
      content: (
        <section>
          <h2>
            {t({
              en: "Live, offline, and replay",
              es: "En vivo, offline y reproducción",
            })}
          </h2>
          <p>
            {t({
              en: "Live computation runs in the browser. Offline computation builds the canonical matrix. Replay artifacts anchor documentation and benchmark claims. All lanes share scenario and certificate contracts.",
              es: "El cálculo en vivo corre en el navegador. El cálculo offline construye la matriz canónica. Los artefactos anclan documentación y benchmark. Todos comparten contratos de escenario y certificado.",
            })}
          </p>
          <MethodFigure kind="pipeline" />
          <Refs
            ids={["hamada2024"]}
            label={t({ en: "Sources", es: "Fuentes" })}
          />
        </section>
      ),
    },
    {
      id: "engines",
      label: t({ en: "Engines", es: "Motores" }),
      content: (
        <SubTabs tabs={engineTabs} orientation="vertical" ariaLabel="engines" />
      ),
    },
    {
      id: "contracts",
      label: t({ en: "Contracts", es: "Contratos" }),
      content: (
        <section>
          <h2>
            {t({
              en: "Scenario and certificate contracts",
              es: "Contratos de escenario y certificado",
            })}
          </h2>
          <p>
            {t({
              en: "The input contract requires identity, category, mathematical expression, angle declaration, finite size, phase, target, process, and seed. The output contract requires grouped lengths, residuals, discrepancy, status, source trail, and a SHA-256 content hash.",
              es: "El contrato de entrada exige identidad, categoría, expresión matemática, declaración angular, tamaño, fase, objetivo, proceso y semilla. El de salida exige longitudes, residuos, discrepancia, estado, fuentes y hash SHA-256.",
            })}
          </p>
          <Equation
            tex={"h=\\operatorname{SHA256}(\\operatorname{canonicalJSON}(C))"}
            caption={t({
              en: "The hash covers the certificate before the hash field is appended.",
              es: "El hash cubre el certificado antes de agregar su propio campo.",
            })}
          />
          <ScientificFigure kind="contracts" />
          <Callout
            variant="strong"
            title={t({ en: "Drift gate", es: "Control de deriva" })}
          >
            <span>
              {t({
                en: "Validation recomputes every content hash and rejects missing or changed matrix cells.",
                es: "La validación recalcula cada hash y rechaza celdas faltantes o alteradas.",
              })}
            </span>
          </Callout>
        </section>
      ),
    },
    {
      id: "evidence",
      label: t({ en: "Evidence", es: "Evidencia" }),
      content: (
        <section>
          <h2>{t({ en: "Immutable scientific evidence", es: "Evidencia científica inmutable" })}</h2>
          <p>{t({ en: "The canonical bake writes one certificate per scenario and a manifest that binds identity, path, regime status, method version, and SHA-256 digest. The browser benchmark is projected from that committed matrix; deployment may validate it but cannot silently rewrite it.", es: "El bake canónico escribe un certificado por escenario y un manifiesto que vincula identidad, ruta, régimen, versión y hash SHA-256. El benchmark del navegador se proyecta desde esa matriz versionada; el despliegue puede validarla, pero no reescribirla." })}</p>
          <p>{t({ en: "Live controls are intentionally separate. They recompute the same contract in memory for exploration and expose when the selected state has diverged from its preset, but they do not masquerade as a new canonical artifact.", es: "Los controles en vivo están separados. Recalculan el mismo contrato en memoria y exponen cuándo el estado diverge del preset, pero no se presentan como un nuevo artefacto canónico." })}</p>
          <ScientificFigure kind="contracts" />
          <Callout variant="honest" title={t({ en: "Provenance boundary", es: "Frontera de procedencia" })}>
            <span>{t({ en: "A screenshot is presentation evidence. The certificate and its digest are scientific evidence.", es: "Una captura es evidencia de presentación. El certificado y su hash son evidencia científica." })}</span>
          </Callout>
        </section>
      ),
    },
    {
      id: "verification",
      label: t({ en: "Verification", es: "Verificación" }),
      content: (
        <section>
          <h2>{t({ en: "Layered release gates", es: "Controles de release por capas" })}</h2>
          <p>{t({ en: "Static guards enforce route and tab contracts, accessible SVGs, language-scoped architecture labels, and the absence of hard-coded figure colors. Unit and reference tests then verify geometry, regimes, deterministic seeds, hashes, and matrix coverage.", es: "Los controles estáticos exigen rutas, pestañas, SVG accesibles, etiquetas de arquitectura por idioma y ausencia de colores rígidos. Las pruebas verifican geometría, regímenes, semillas, hashes y cobertura." })}</p>
          <p>{t({ en: "The final gate is rendered interaction: direct routes, every tab, both themes, both languages, and narrow and desktop viewports. Computed SVG fills and text colors are inspected so a technically present figure cannot pass as an opaque black panel.", es: "El control final es la interacción renderizada: rutas directas, cada pestaña, ambos temas, ambos idiomas y vistas móvil y escritorio. Se inspeccionan colores calculados para impedir que una figura presente pase como panel negro." })}</p>
          <ScientificFigure kind="protocol" />
          <Equation tex={"release=guards\\land tests\\land build\\land rendered\\ QA"} caption={t({ en: "No individual green signal is treated as delivery.", es: "Ninguna señal verde aislada se trata como entrega." })} />
        </section>
      ),
    },
    {
      id: "release",
      label: t({ en: "Release", es: "Release" }),
      content: (
        <section>
          <h2>{t({ en: "Static publication", es: "Publicación estática" })}</h2>
          <p>
            {t({
              en: "GitHub Actions installs locked dependencies, runs the sandboxed reference smoke, validates committed artifacts, type-checks and tests the browser engine, builds the static bundle, and publishes it to GitHub Pages. The custom domain is bound separately and HTTPS is enforced.",
              es: "GitHub Actions instala dependencias bloqueadas, ejecuta la prueba aislada, valida artefactos versionados, verifica y prueba el motor web, construye el bundle y publica en GitHub Pages. El dominio se enlaza por separado y HTTPS es obligatorio.",
            })}
          </p>
          <MethodFigure kind="pipeline" />
          <Callout
            variant="honest"
            title={t({
              en: "No runtime service",
              es: "Sin servicio en ejecución",
            })}
          >
            <span>
              {t({
                en: "The release needs no API, account, secret, database, or server-side mathematical computation.",
                es: "El release no necesita API, cuenta, secreto, base de datos ni cálculo matemático del lado servidor.",
              })}
            </span>
          </Callout>
        </section>
      ),
    },
  ];
  return (
    <main className="page-body prose">
      <PageHead
        title={{ en: "Implementation", es: "Implementación" }}
        lede={{
          en: "GapTheo separates live interaction, offline reference computation, committed evidence, and deployment. This page documents exact algorithms and the boundaries between those lanes.",
          es: "GapTheo separa interacción en vivo, cálculo de referencia offline, evidencia versionada y despliegue. Esta página documenta algoritmos exactos y los límites entre carriles.",
        }}
      />
      <Tabs tabs={tabs} ariaLabel="implementation" />
    </main>
  );
}

export function ExperimentsPage() {
  const t = useT();
  const tabs = [
    {
      id: "matrix",
      label: t({ en: "Coverage matrix", es: "Matriz de cobertura" }),
      content: (
        <section>
          <h2>
            {t({
              en: "Twelve canonical scenarios",
              es: "Doce escenarios canónicos",
            })}
          </h2>
          <p>
            {t({
              en: "The matrix spans five known irrational constants and quadratic patterns, phase and finite-size changes, a near-rational conditioning case, two exact rational boundaries, and two non-arithmetic negative controls. Every scenario fixes the seed and endpoint convention.",
              es: "La matriz cubre constantes irracionales y patrones cuadráticos, cambios de fase y tamaño, un caso casi racional, dos fronteras racionales exactas y dos controles no aritméticos. Cada escenario fija semilla y convención de extremo.",
            })}
          </p>
          <table className="evidence-table">
            <thead>
              <tr>
                <th>{t({ en: "Partition", es: "Partición" })}</th>
                <th>{t({ en: "Cases", es: "Casos" })}</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(benchmark.partitions).map(([name, ids]) => (
                <tr key={name}>
                  <td>{name}</td>
                  <td>{ids.join(" · ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <ScientificFigure kind="benchmark" />
          <Refs
            ids={["hamada2024", "alessandri1998"]}
            label={t({ en: "Sources", es: "Fuentes" })}
          />
        </section>
      ),
    },
    {
      id: "events",
      label: t({ en: "Event sweep", es: "Barrido de eventos" }),
      content: (
        <section>
          <h2>{t({ en: "Vary N and alpha", es: "Variar N y alfa" })}</h2>
          <p>
            {t({
              en: "Sweep N across convergent denominators and move alpha across a Farey boundary. Record the distinct-gap count, multiplicities, and additive residual. The expected change is combinatorial and localized at rational event boundaries.",
              es: "Barra N sobre denominadores convergentes y mueva alfa sobre una frontera de Farey. Registre cantidad de brechas, multiplicidades y residuo aditivo. El cambio esperado es combinatorio y localizado.",
            })}
          </p>
          <MethodFigure kind="farey" />
          <Equation
            tex={"\\rho=|c-a-b|"}
            caption={t({
              en: "The additive residual is evaluated only in a three-length state.",
              es: "El residuo aditivo se evalúa solo con tres longitudes.",
            })}
          />
        </section>
      ),
    },
    {
      id: "phase",
      label: t({ en: "Phase invariance", es: "Invariancia de fase" }),
      content: (
        <section>
          <h2>
            {t({ en: "Rotate the whole sample", es: "Rotar toda la muestra" })}
          </h2>
          <p>
            {t({
              en: "Changing phase translates every point around the circle without changing circular gap lengths. The phase-shifted golden case is a positive control for that invariance and a regression test for wrap-gap handling.",
              es: "Cambiar la fase traslada cada punto alrededor del círculo sin cambiar longitudes. El caso áureo con fase es un control positivo y una prueba de regresión para el cierre.",
            })}
          </p>
          <Equation
            tex={"g_i(\\phi)=g_i(0)"}
            caption={t({
              en: "The multiset of circular gaps is phase invariant.",
              es: "El multiconjunto de brechas es invariante ante fase.",
            })}
          />
          <MethodFigure kind="orbit" />
        </section>
      ),
    },
    {
      id: "negative",
      label: t({ en: "Negative controls", es: "Controles negativos" }),
      content: (
        <section>
          <h2>{t({ en: "Change the process", es: "Cambiar el proceso" })}</h2>
          <p>
            {t({
              en: "Seeded random placement and greedy largest-gap bisection deliberately remove the arithmetic rotation mechanism. Their certificates remain reproducible, but the theorem badge becomes contrast and no three-gap claim is made.",
              es: "La ubicación aleatoria y la bisección voraz eliminan deliberadamente el mecanismo aritmético. Sus certificados siguen siendo reproducibles, pero el distintivo pasa a contraste y no se afirma el teorema.",
            })}
          </p>
          <Callout
            variant="honest"
            title={t({ en: "Kill criterion", es: "Criterio de refutación" })}
          >
            <span>
              {t({
                en: "Any contrast process shown as certified, or any theorem case with more than three grouped gaps, fails the release matrix.",
                es: "Todo contraste mostrado como certificado, o caso del teorema con más de tres brechas, hace fallar el release.",
              })}
            </span>
          </Callout>
          <ScientificFigure kind="protocol" />
        </section>
      ),
    },
    {
      id: "dual",
      label: t({ en: "Dual interval", es: "Intervalo dual" }),
      content: (
        <section>
          <h2>
            {t({
              en: "Move beta across return regimes",
              es: "Mover beta entre regímenes",
            })}
          </h2>
          <p>
            {t({
              en: "The target beta changes which indices visit [0,beta). The experiment tracks the return-gap alphabet and checks that the strict endpoint convention is recorded. It does not compare return integers directly with geometric lengths.",
              es: "El objetivo beta cambia qué índices visitan [0,beta). El experimento registra el alfabeto de retornos y la convención estricta. No compara enteros de retorno con longitudes geométricas.",
            })}
          </p>
          <MethodFigure kind="dual" />
          <Refs
            ids={["hamada2024"]}
            label={t({ en: "Sources", es: "Fuentes" })}
          />
        </section>
      ),
    },
    {
      id: "protocol",
      label: t({ en: "Protocol", es: "Protocolo" }),
      content: (
        <section>
          <h2>
            {t({
              en: "Leakage-free deterministic protocol",
              es: "Protocolo determinista sin fuga",
            })}
          </h2>
          <p>
            {t({
              en: "No parameters are fit from expected outputs. Scenarios are partitioned by theorem, boundary, and contrast regimes before evaluation. A sandbox smoke recomputes all cells, while committed hashes remain read-only during CI and deployment.",
              es: "Ningún parámetro se ajusta desde salidas esperadas. Los escenarios se separan por régimen antes de evaluar. Una prueba aislada recalcula todas las celdas mientras los hashes versionados permanecen de solo lectura.",
            })}
          </p>
          <MethodFigure kind="pipeline" />
          <Callout
            variant="strong"
            title={t({ en: "Reproducible", es: "Reproducible" })}
          >
            <span>
              {t({
                en: "The same scenario and version must produce the same canonical JSON content hash.",
                es: "El mismo escenario y versión debe producir el mismo hash del JSON canónico.",
              })}
            </span>
          </Callout>
        </section>
      ),
    },
  ];
  return (
    <main className="page-body prose">
      <PageHead
        title={{ en: "Experiments", es: "Experimentos" }}
        lede={{
          en: "The experimental design tests theorem cases, numerical boundaries, invariances, and deliberate negative controls. It separates mathematical applicability from software invariants and records a deterministic kill criterion for every release.",
          es: "El diseño experimental prueba casos del teorema, fronteras numéricas, invariancias y controles negativos deliberados. Separa aplicabilidad matemática de invariantes de software y registra criterios de refutación deterministas.",
        }}
      />
      <Tabs tabs={tabs} ariaLabel="experiments" />
    </main>
  );
}

export function BenchmarkPage() {
  const t = useT();
  const es = useShellLang() === "es";
  const maxResidual = Math.max(
    ...benchmark.cells.map((cell) => cell.sumResidual),
  );
  const maxPartition = Math.max(
    ...benchmark.cells.map((cell) => cell.partitionResidual),
  );
  const tabs = [
    {
      id: "matrix",
      label: t({ en: "Matrix", es: "Matriz" }),
      content: (
        <section>
          <h2>
            {benchmark.summary.passed} / {benchmark.summary.total}{" "}
            {t({ en: "canonical cells pass", es: "celdas canónicas pasan" })}
          </h2>
          <div className="benchmark-grid">
            {benchmark.cells.map((cell) => (
              <article key={cell.scenarioId} className="benchmark-cell">
                <span
                  className={`status-dot ${cell.passed ? "pass" : "fail"}`}
                />
                <div>
                  <strong>{cell.scenarioId}</strong>
                  <small>
                    {es
                      ? (CATEGORY_ES[cell.category] ?? cell.category)
                      : cell.category}
                  </small>
                </div>
                <span className="benchmark-count">
                  <b>{cell.distinctCount}</b>
                  <small>{t({ en: "gaps", es: "brechas" })}</small>
                </span>
              </article>
            ))}
          </div>
          <MethodFigure kind="matrix" />
        </section>
      ),
    },
    {
      id: "residuals",
      label: t({ en: "Residuals", es: "Residuos" }),
      content: (
        <section>
          <h2>
            {t({ en: "Numerical invariants", es: "Invariantes numéricos" })}
          </h2>
          <div className="metric-grid">
            <div className="metric">
              <span>
                {t({
                  en: "maximum additive residual",
                  es: "residuo aditivo máximo",
                })}
              </span>
              <strong>{maxResidual.toExponential(2)}</strong>
            </div>
            <div className="metric">
              <span>
                {t({
                  en: "maximum partition residual",
                  es: "residuo de partición máximo",
                })}
              </span>
              <strong>{maxPartition.toExponential(2)}</strong>
            </div>
          </div>
          <Equation
            tex={"\\epsilon_{partition}=|\\sum_i g_i-1|"}
            caption={t({
              en: "Independent closure invariant across all processes.",
              es: "Invariante de cierre independiente en todos los procesos.",
            })}
          />
          <ScientificFigure kind="benchmark" />
        </section>
      ),
    },
    {
      id: "discrepancy",
      label: t({ en: "Discrepancy", es: "Discrepancia" }),
      content: (
        <section>
          <h2>
            {t({
              en: "Uniformity is not the theorem",
              es: "Uniformidad no es el teorema",
            })}
          </h2>
          <p>
            {t({
              en: "Star discrepancy measures how evenly the finite points fill anchored intervals. It gives a useful cross-case scalar, but it neither proves nor replaces the three-gap statement.",
              es: "La discrepancia estrella mide cuán uniformemente los puntos llenan intervalos anclados. Es un escalar útil, pero no prueba ni reemplaza el teorema.",
            })}
          </p>
          <Equation
            tex={"D_N^*=\\sup_{0\\leq x\\leq1}|N^{-1}\\#\\{x_i<x\\}-x|"}
            caption={t({
              en: "One-dimensional star discrepancy of the finite sample.",
              es: "Discrepancia estrella unidimensional de la muestra.",
            })}
          />
          <MethodFigure kind="matrix" />
          <Refs
            ids={["haynes2014"]}
            label={t({ en: "Sources", es: "Fuentes" })}
          />
        </section>
      ),
    },
    {
      id: "regimes",
      label: t({ en: "Regimes", es: "Regímenes" }),
      content: (
        <section>
          <h2>{t({ en: "Coverage by mathematical regime", es: "Cobertura por régimen matemático" })}</h2>
          <p>{t({ en: "Eight theorem cells exercise declared irrational rotations, finite-size variation, phase translation, and near-rational conditioning. Two exact rational cells verify boundary labelling. Two non-rotation allocators verify that reproducibility does not incorrectly imply theorem applicability.", es: "Ocho celdas prueban rotaciones irracionales declaradas, tamaño finito, fase y condicionamiento casi racional. Dos celdas racionales verifican la frontera. Dos asignadores no rotacionales verifican que reproducibilidad no implique aplicabilidad." })}</p>
          <div className="metric-grid">
            {Object.entries(benchmark.partitions).map(([name, ids]) => (
              <div className="metric" key={name}><span>{name}</span><strong>{ids.length}</strong><small>{ids.join(" · ")}</small></div>
            ))}
          </div>
          <ScientificFigure kind="events" />
        </section>
      ),
    },
    {
      id: "provenance",
      label: t({ en: "Provenance", es: "Procedencia" }),
      content: (
        <section>
          <h2>{t({ en: "Artifact-backed claims", es: "Afirmaciones respaldadas por artefactos" })}</h2>
          <p>{t({ en: "This page reads its totals, categories, verdicts, distinct counts, residuals, dual counts, and discrepancy values directly from the committed benchmark JSON. The canonical manifest separately binds each source certificate to its content hash.", es: "Esta página lee totales, categorías, veredictos, cantidades, residuos, retornos y discrepancias directamente del JSON versionado. El manifiesto canónico vincula cada certificado con su hash." })}</p>
          <Equation tex={"B=\\Pi(\\{C_s:s\\in S_{canonical}\\})"} caption={t({ en: "The benchmark is a deterministic projection of canonical certificates.", es: "El benchmark es una proyección determinista de certificados canónicos." })} />
          <ScientificFigure kind="contracts" />
          <Callout variant="strong" title={t({ en: "Current matrix", es: "Matriz actual" })}>
            <span>{benchmark.summary.total} {t({ en: "cells, protocol", es: "celdas, protocolo" })}: {benchmark.protocol}; v{benchmark.version}.</span>
          </Callout>
        </section>
      ),
    },
    {
      id: "limits",
      label: t({ en: "Limits", es: "Límites" }),
      content: (
        <section>
          <h2>
            {t({
              en: "What the benchmark establishes",
              es: "Qué establece el benchmark",
            })}
          </h2>
          <p>
            {t({
              en: "It establishes deterministic agreement of the reference invariants across the declared canonical matrix. It does not estimate statistical generalization, compare learned models, or claim formal proof equivalence. Those concepts are not applicable to this exact finite theorem instrument.",
              es: "Establece acuerdo determinista de invariantes en la matriz declarada. No estima generalización estadística, compara modelos aprendidos ni afirma equivalencia con una prueba formal. Esos conceptos no aplican a este instrumento exacto.",
            })}
          </p>
          <Callout
            variant="honest"
            title={t({
              en: "Mathematical adaptation",
              es: "Adaptación matemática",
            })}
          >
            <span>
              {t({
                en: "Forcing a machine-learning benchmark into a theorem atlas would fabricate an irrelevant task. The honest benchmark compares exact and numerical certificate invariants.",
                es: "Forzar un benchmark de aprendizaje automático fabricaría una tarea irrelevante. El benchmark honesto compara invariantes de certificados exactos y numéricos.",
              })}
            </span>
          </Callout>
          <ScientificFigure kind="protocol" />
          <Refs
            ids={["mayero2006", "hamada2024"]}
            label={t({ en: "Sources", es: "Fuentes" })}
          />
        </section>
      ),
    },
  ];
  return (
    <main className="page-body prose">
      <PageHead
        title={{ en: "Benchmark", es: "Benchmark" }}
        lede={{
          en: "The benchmark is generated from the committed twelve-case artifact matrix. It reports theorem-bound checks, partition closure, dual return bounds, additive residuals, and star discrepancy without typed-in result claims.",
          es: "El benchmark se genera desde la matriz versionada de doce casos. Informa límites del teorema, cierre de partición, retornos duales, residuos aditivos y discrepancia sin resultados escritos manualmente.",
        }}
      />
      <Tabs tabs={tabs} ariaLabel="benchmark" />
    </main>
  );
}

export function ResearchRoute({ path }: { path: string }) {
  if (path === "/methodology") return <MethodologyPage />;
  if (path === "/implementation") return <ImplementationPage />;
  if (path === "/experiments") return <ExperimentsPage />;
  if (path === "/benchmark") return <BenchmarkPage />;
  return <IntroductionPage />;
}
