import { Tabs } from "@fasl-work/caos-app-shell";
import { MethodBlock, PageHead, useT } from "./research/ResearchShared";

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
