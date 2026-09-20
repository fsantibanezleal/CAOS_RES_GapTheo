import {
  Callout,
  Equation,
  Figure,
  InlineMath,
  Refs,
  SubTabs,
  Tabs,
  useShellLang,
} from "@fasl-work/caos-app-shell";
import benchmark from "../data/benchmark.json";

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

function MethodFigure({
  kind,
}: {
  kind: "orbit" | "farey" | "dual" | "topology" | "pipeline" | "matrix";
}) {
  const t = useT();
  if (kind === "orbit")
    return (
      <Figure
        caption={t({
          en: "The sorted orbit closes with one wrap gap.",
          es: "La órbita ordenada se cierra con una brecha envolvente.",
        })}
      >
        <svg className="fig-svg" viewBox="0 0 620 260" role="img">
          <circle cx="180" cy="130" r="92" className="diagram-ring" />
          {[0, 0.12, 0.28, 0.46, 0.63, 0.82].map((v, i) => (
            <circle
              key={v}
              cx={180 + 92 * Math.cos(v * Math.PI * 2)}
              cy={130 + 92 * Math.sin(v * Math.PI * 2)}
              r={i === 2 ? 8 : 5}
              className="diagram-point"
            />
          ))}
          <path
            d="M330 70H570M330 120H520M330 170H555"
            className="diagram-line"
          />
          <text x="342" y="61">
            a
          </text>
          <text x="342" y="111">
            b
          </text>
          <text x="342" y="161">
            c = a + b
          </text>
        </svg>
      </Figure>
    );
  if (kind === "farey")
    return (
      <Figure
        caption={t({
          en: "A fixed N partitions the alpha axis into Farey cells.",
          es: "Un N fijo divide el eje alfa en celdas de Farey.",
        })}
      >
        <svg className="fig-svg" viewBox="0 0 620 260" role="img">
          <path
            d="M30 220C140 190 190 80 300 120S470 210 590 40"
            className="diagram-curve"
          />
          <path
            d="M30 200C150 70 240 210 350 110S500 60 590 180"
            className="diagram-curve alt"
          />
          {[90, 180, 275, 390, 500].map((x) => (
            <line
              key={x}
              x1={x}
              x2={x}
              y1="32"
              y2="228"
              className="diagram-grid"
            />
          ))}
          <line x1="365" x2="365" y1="24" y2="232" className="diagram-cursor" />
        </svg>
      </Figure>
    );
  if (kind === "dual")
    return (
      <Figure
        caption={t({
          en: "Visits to the beta interval generate index gaps.",
          es: "Las visitas al intervalo beta generan brechas de índices.",
        })}
      >
        <svg className="fig-svg" viewBox="0 0 620 220" role="img">
          <rect
            x="30"
            y="75"
            width="210"
            height="55"
            rx="8"
            className="diagram-band"
          />
          <line x1="30" x2="590" y1="145" y2="145" className="diagram-line" />
          {[55, 105, 180, 275, 350, 470, 545].map((x, i) => (
            <g key={x}>
              <line x1={x} x2={x} y1="128" y2="162" className="diagram-tick" />
              <text x={x - 7} y="185">
                {[0, 2, 5, 8, 10, 13, 16][i]}
              </text>
            </g>
          ))}
        </svg>
      </Figure>
    );
  if (kind === "topology")
    return (
      <Figure
        caption={t({
          en: "Each component dies when the threshold reaches an observed circular gap.",
          es: "Cada componente muere cuando el umbral alcanza una brecha circular observada.",
        })}
      >
        <svg className="fig-svg" viewBox="0 0 620 250" role="img">
          {Array.from({ length: 9 }, (_, i) => (
            <line
              key={i}
              x1="60"
              x2={130 + i * 45}
              y1={35 + i * 22}
              y2={35 + i * 22}
              className="diagram-bar"
            />
          ))}
          <line x1="60" x2="570" y1="228" y2="228" className="diagram-line" />
          <text x="60" y="246">
            0
          </text>
          <text x="510" y="246">
            threshold
          </text>
        </svg>
      </Figure>
    );
  if (kind === "pipeline")
    return (
      <Figure
        caption={t({
          en: "Canonical evidence moves through named deterministic stages.",
          es: "La evidencia canónica atraviesa etapas deterministas nombradas.",
        })}
      >
        <svg className="fig-svg wide" viewBox="0 0 760 220" role="img">
          {[
            "ingest",
            "preprocess",
            "partition",
            "infer",
            "evaluate",
            "export",
            "validate",
          ].map((name, i) => (
            <g key={name}>
              <rect
                x={20 + i * 105}
                y="70"
                width="90"
                height="66"
                rx="10"
                className="diagram-box"
              />
              <text x={30 + i * 105} y="108">
                {name}
              </text>
              {i < 6 && (
                <path
                  d={`M${110 + i * 105} 103H${122 + i * 105}`}
                  className="diagram-line"
                />
              )}
            </g>
          ))}
        </svg>
      </Figure>
    );
  return (
    <Figure
      caption={t({
        en: "Every published number is read from the committed benchmark artifact.",
        es: "Cada número publicado se lee del artefacto de benchmark versionado.",
      })}
    >
      <svg className="fig-svg" viewBox="0 0 620 240" role="img">
        {benchmark.cells.map((cell, i) => (
          <g key={cell.scenarioId}>
            <rect
              x="55"
              y={20 + i * 17}
              width={Math.max(4, cell.starDiscrepancy * 3800)}
              height="10"
              className={cell.passed ? "diagram-bar" : "diagram-bar warn"}
            />
          </g>
        ))}
        <text x="410" y="224">
          star discrepancy
        </text>
      </svg>
    </Figure>
  );
}

function MethodBlock({
  title,
  paragraphs,
  equation,
  caption,
  figure,
  refs,
  boundary,
}: {
  title: Copy;
  paragraphs: Copy[];
  equation: string;
  caption: Copy;
  figure: Parameters<typeof MethodFigure>[0]["kind"];
  refs: string[];
  boundary: Copy;
}) {
  const t = useT();
  return (
    <section className="method-block">
      <h2>{t(title)}</h2>
      {paragraphs.map((p, index) => (
        <p key={index}>{t(p)}</p>
      ))}
      <Equation tex={equation} caption={t(caption)} />
      <MethodFigure kind={figure} />
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
  return (
    <main className="page-body prose">
      <PageHead
        title={{ en: "Introduction", es: "Introducción" }}
        lede={{
          en: "GapTheo turns a finite rotation into an inspectable mathematical object. It shows what the three-gap theorem states, how several exact descriptions explain the same partition, and where rational or non-arithmetic processes leave the theorem regime.",
          es: "GapTheo transforma una rotación finita en un objeto matemático inspeccionable. Muestra qué afirma el teorema de las tres brechas, cómo varias descripciones exactas explican la misma partición y dónde los procesos racionales o no aritméticos abandonan su régimen.",
        }}
      />
      <section>
        <h2>{t({ en: "The problem", es: "El problema" })}</h2>
        <p>
          {t({
            en: "Place the points x_n = {phase + n alpha} on the unit circle, sort them, and measure every adjacent circular gap including the wrap from the last point to the first. For an irrational rotation, the finite partition has at most three distinct lengths. When three appear, the largest is the sum of the other two.",
            es: "Ubique los puntos x_n = {fase + n alfa} en el círculo unitario, ordénelos y mida cada brecha circular adyacente, incluido el cierre desde el último punto al primero. Para una rotación irracional, la partición finita tiene como máximo tres longitudes. Cuando aparecen tres, la mayor es la suma de las otras dos.",
          })}
        </p>
        <Equation
          tex={"x_n=\\{\\phi+n\\alpha\\},\\qquad D_N\\leq 3"}
          caption={t({
            en: "The direct finite orbit and its distinct-gap bound.",
            es: "La órbita finita directa y su límite de brechas distintas.",
          })}
        />
        <MethodFigure kind="orbit" />
        <Refs
          ids={["hamada2024", "alessandri1998"]}
          label={t({ en: "Sources", es: "Fuentes" })}
        />
      </section>
      <section>
        <h2>
          {t({ en: "Ten linked readings", es: "Diez lecturas vinculadas" })}
        </h2>
        <p>
          {t({
            en: "The orbit, gap genealogy, Farey cell, continued fraction, return indices, cyclic word, lattice window, interval exchange, discrepancy profile, and zero-dimensional topology are not independent decorations. They are synchronized readings of one selected finite state, with the direct sorted partition retained as the numerical oracle.",
            es: "La órbita, genealogía, celda de Farey, fracción continua, índices de retorno, palabra cíclica, ventana de retículo, intercambio de intervalos, perfil de discrepancia y topología de dimensión cero no son decoraciones independientes. Son lecturas sincronizadas de un estado finito seleccionado, con la partición ordenada directa como oráculo numérico.",
          })}
        </p>
        <Refs
          ids={["berthe2024", "marklof2017", "taha2018", "dasgupta2023"]}
          label={t({ en: "Sources", es: "Fuentes" })}
        />
      </section>
      <section>
        <h2>
          {t({ en: "Symbols and conventions", es: "Símbolos y convenciones" })}
        </h2>
        <ul className="symbol-grid">
          <li>
            <InlineMath tex="\\alpha" />:{" "}
            {t({ en: "angle step in turns", es: "paso angular en vueltas" })}
          </li>
          <li>
            <InlineMath tex="N" />:{" "}
            {t({ en: "number of orbit points", es: "cantidad de puntos" })}
          </li>
          <li>
            <InlineMath tex="\\phi" />:{" "}
            {t({ en: "phase offset", es: "desfase" })}
          </li>
          <li>
            <InlineMath tex="\\beta" />:{" "}
            {t({
              en: "target interval length",
              es: "longitud del intervalo objetivo",
            })}
          </li>
          <li>
            <InlineMath tex="a,b,c" />:{" "}
            {t({ en: "ordered gap lengths", es: "longitudes ordenadas" })}
          </li>
          <li>
            <InlineMath tex="D_N" />:{" "}
            {t({
              en: "number of distinct lengths",
              es: "cantidad de longitudes distintas",
            })}
          </li>
          <li>
            <InlineMath tex="p/q" />:{" "}
            {t({
              en: "rational boundary input",
              es: "entrada racional de frontera",
            })}
          </li>
          <li>
            <InlineMath tex="q_k" />:{" "}
            {t({ en: "convergent denominator", es: "denominador convergente" })}
          </li>
          <li>
            <InlineMath tex="H_0" />:{" "}
            {t({
              en: "connected-component homology",
              es: "homología de componentes",
            })}
          </li>
          <li>
            <InlineMath tex="D_N^*" />:{" "}
            {t({ en: "star discrepancy", es: "discrepancia estrella" })}
          </li>
        </ul>
      </section>
      <section>
        <h2>
          {t({
            en: "What this app is and is not",
            es: "Qué es y qué no es esta app",
          })}
        </h2>
        <Callout
          variant="honest"
          title={t({ en: "Honest scope", es: "Alcance honesto" })}
        >
          <span>
            {t({
              en: "The app is a reproducible finite certificate atlas. It is not a new theorem, a proof assistant, a general persistent-homology package, or an irrationality test for decimal input.",
              es: "La app es un atlas reproducible de certificados finitos. No es un teorema nuevo, un asistente de pruebas, un paquete general de homología persistente ni una prueba de irracionalidad para entradas decimales.",
            })}
          </span>
        </Callout>
        <Refs
          ids={["mayero2006", "suarez2026"]}
          label={t({ en: "Sources", es: "Fuentes" })}
        />
      </section>
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
