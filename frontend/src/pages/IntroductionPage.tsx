import { Callout, DocSection, Equation, Glossary, Tabs } from "@fasl-work/caos-app-shell";
import { MethodFigure, useT } from "./research/ResearchShared";
import { ScientificFigure } from "./ScientificFigures";

export function IntroductionPage() {
  const t = useT();
  const tabs = [
    {
      id: "problem",
      label: t({ en: "Problem", es: "Problema" }),
      content: (
        <DocSection area="problem" refs={["hamada2024", "alessandri1998"]} title={t({ en: "A finite orbit cuts the unit circle", es: "Una órbita finita corta el círculo unitario" })}>
        <div className="research-chapter">
          <span className="eyebrow">{t({ en: "WHAT IS MEASURED?", es: "¿QUÉ SE MIDE?" })}</span>
          <p>{t({ en: "Choose an angle step alpha, a phase phi, and a finite point count N. GapTheo evaluates x_n = {phi + n alpha} for n from zero through N-1, sorts those positions, and measures every adjacent circular arc, including the wrap from the last sorted point back to the first. The theorem concerns the number of distinct arc lengths, not the number of arcs and not Euclidean chord lengths.", es: "Elija un paso angular alfa, una fase phi y una cantidad finita N. GapTheo evalúa x_n = {phi + n alfa} para n entre cero y N-1, ordena esas posiciones y mide cada arco circular adyacente, incluido el cierre desde el último punto al primero. El teorema trata la cantidad de longitudes de arco distintas, no la cantidad de arcos ni las cuerdas euclidianas." })}</p>
          <p>{t({ en: "For an irrational rotation, the finite partition has at most three distinct lengths. When all three occur, the largest is the sum of the two smaller lengths. GapTheo keeps the unconditional closure invariant separate from that theorem certificate: every allocator must form a valid partition, but only a declared irrational one-frequency rotation enters the classical theorem regime.", es: "Para una rotación irracional, la partición finita tiene como máximo tres longitudes distintas. Cuando aparecen las tres, la mayor es la suma de las dos menores. GapTheo mantiene separado el invariante incondicional de cierre del certificado teórico: todo asignador debe formar una partición válida, pero solo una rotación irracional declarada de una frecuencia entra al régimen clásico." })}</p>
          <Equation tex={"x_n=\\{\\phi+n\\alpha\\},\\quad 0\\le n<N"} caption={t({ en: "Finite rotation orbit in turns; braces denote fractional part.", es: "Órbita finita en vueltas; las llaves denotan parte fraccionaria." })} />
          <Equation tex={"\\sum_{i=0}^{N-1}g_i=1,\\qquad D_N=\\#\\{g_i\\}\\le 3"} caption={t({ en: "Partition closure and the distinct-length bound are separate assertions.", es: "El cierre de la partición y la cota de longitudes son aserciones separadas." })} />
          <MethodFigure kind="orbit" />
          <Callout variant="honest" title={t({ en: "Hypothesis", es: "Hipótesis" })}><span>{t({ en: "A finite decimal does not certify irrationality. The scenario stores the mathematical declaration and the certificate reports numerical conditioning separately.", es: "Un decimal finito no certifica irracionalidad. El escenario almacena la declaración matemática y el certificado informa el condicionamiento por separado." })}</span></Callout>
        </div></DocSection>
      ),
    },
    {
      id: "mechanism",
      label: t({ en: "Mechanism", es: "Mecanismo" }),
      content: (
        <DocSection area="principles" refs={["alessandri1998", "hamada2024"]} title={t({ en: "One insertion, one parent arc, two children", es: "Una inserción, un arco padre, dos hijos" })}>
        <div className="research-chapter">
          <span className="eyebrow">{t({ en: "HOW DOES N CHANGE THE STATE?", es: "¿CÓMO CAMBIA N EL ESTADO?" })}</span>
          <p>{t({ en: "Read the orbit in index order. A new non-colliding point lies inside exactly one existing empty arc. That parent gap disappears and two identified child gaps replace it, while all other gaps persist. The split conserves length. Stable point and gap identifiers let playback, circle selection, the cyclic word, and topology refer to the same event instead of presenting disconnected animations.", es: "Lea la órbita en orden de índices. Un punto nuevo sin colisión cae dentro de exactamente un arco vacío existente. Esa brecha padre desaparece y dos brechas hijas identificadas la reemplazan, mientras todas las demás persisten. La división conserva longitud. Identificadores estables permiten que reproducción, selección, palabra cíclica y topología se refieran al mismo evento." })}</p>
          <p>{t({ en: "At a rational collision there is no interior split. The engine records the duplicate residue and multiplicity instead of manufacturing zero-length children. This distinction matters because the genealogy is explanatory evidence built from the direct orbit; it must preserve the actual finite geometry even outside the theorem regime.", es: "En una colisión racional no hay división interior. El motor registra el residuo duplicado y su multiplicidad en vez de fabricar hijos de longitud cero. La distinción importa porque la genealogía es evidencia explicativa construida desde la órbita directa y debe preservar la geometría finita real aun fuera del régimen." })}</p>
          <Equation tex={"g_{parent}=g_{left}+g_{right}"} caption={t({ en: "Local conservation law for each non-colliding insertion.", es: "Ley de conservación local para cada inserción sin colisión." })} />
          <ScientificFigure kind="split" />
          <Callout variant="honest" title={t({ en: "Interpretation", es: "Interpretación" })}><span>{t({ en: "The lineage explains finite updates and supports implementation checks. It is not presented as a new proof of the theorem.", es: "La genealogía explica actualizaciones finitas y permite verificar la implementación. No se presenta como una prueba nueva del teorema." })}</span></Callout>
        </div></DocSection>
      ),
    },
    {
      id: "readings",
      label: t({ en: "Linked readings", es: "Lecturas vinculadas" }),
      content: (
        <DocSection area="pipeline" refs={["berthe2024", "marklof2017", "taha2018", "suarez2026"]} title={t({ en: "Views computed from one finite certificate", es: "Vistas calculadas desde un certificado finito" })}>
        <div className="research-chapter">
          <span className="eyebrow">{t({ en: "WHY MORE THAN ONE VIEW?", es: "¿POR QUÉ MÁS DE UNA VISTA?" })}</span>
          <p>{t({ en: "The circle exposes primary geometry but not the rational skeleton controlling event changes. Farey neighbours and continued fractions explain arithmetic scales; return times ask a dual question about visits to a target interval; cyclic words preserve class order; the lattice view packages Diophantine information geometrically; and finite H0 records observed gaps as merge thresholds. These are projections of one selected state, not decorative topics assembled on one page.", es: "El círculo expone la geometría primaria, pero no el esqueleto racional que controla los eventos. Farey y fracciones explican escalas aritméticas; los retornos formulan una pregunta dual; las palabras preservan el orden; el retículo empaqueta información diofántica; y H0 registra brechas como umbrales. Son proyecciones de un estado seleccionado, no temas decorativos reunidos en una página." })}</p>
          <p>{t({ en: "Changing alpha, N, phase, beta, allocator, or seed first creates a new immutable direct certificate. Every secondary panel consumes that state and exposes residuals when a predicted inventory disagrees. No panel owns a hidden scenario, so a visually plausible but stale view cannot silently survive a control change.", es: "Cambiar alfa, N, fase, beta, asignador o semilla crea primero un nuevo certificado directo inmutable. Cada panel secundario consume ese estado y expone residuos si un inventario predicho discrepa. Ningún panel conserva un escenario oculto, por lo que una vista plausible pero obsoleta no sobrevive silenciosamente a un control." })}</p>
          <Equation tex={"C=F(\\alpha,N,\\phi,\\beta,\\mathrm{allocator},\\mathrm{seed}),\\qquad V_j=\\pi_j(C)"} caption={t({ en: "Every reading is a named projection of one deterministic certificate.", es: "Cada lectura es una proyección nombrada de un certificado determinista." })} />
          <ol>
            <li>{t({ en: "Declare alpha, phase, point count, regime, interval, allocator, and seed.", es: "Declare alfa, fase, cantidad de puntos, régimen, intervalo, asignador y semilla." })}</li>
            <li>{t({ en: "Construct the finite orbit and close its sorted circular partition.", es: "Construya la órbita finita y cierre su partición circular ordenada." })}</li>
            <li>{t({ en: "Compute geometric, Farey, return, and topology readings with residuals.", es: "Calcule lecturas geométricas, de Farey, retornos y topología con sus residuos." })}</li>
            <li>{t({ en: "Validate the certificate and render every view from that shared state.", es: "Valide el certificado y genere cada vista desde ese estado compartido." })}</li>
          </ol>
          <ScientificFigure kind="readings" />
          <Callout variant="honest" title={t({ en: "Evidence boundary", es: "Límite de evidencia" })}><span>{t({ en: "Cross-view agreement validates implementation consistency. Shared inputs mean the views are not automatically logically independent proofs.", es: "El acuerdo entre vistas valida consistencia de implementación. Entradas compartidas implican que las vistas no son pruebas lógicamente independientes." })}</span></Callout>
        </div></DocSection>
      ),
    },
    {
      id: "notation",
      label: t({ en: "Notation", es: "Notación" }),
      content: (
        <DocSection area="math" refs={["hamada2024", "mayero2006"]} title={t({ en: "Definitions that determine the finite object", es: "Definiciones que determinan el objeto finito" })}>
        <div className="research-chapter">
          <span className="eyebrow">{t({ en: "BUILD CONVENTIONS", es: "CONVENCIONES DEL SISTEMA" })}</span>
          <p>{t({ en: "GapTheo counts N points indexed from zero to N-1 and measures normalized arc lengths in turns. The sorted orbit always includes the wrap gap. Numerical mode validates raw arcs before grouping them at a visible absolute tolerance. Rational mode evaluates modular integer residues before applying phase, preventing accumulated multiplication error. Return mode uses a displayed half-open target interval [0,beta).", es: "GapTheo cuenta N puntos indexados de cero a N-1 y mide arcos normalizados en vueltas. La órbita ordenada siempre incluye el cierre. El modo numérico valida arcos crudos antes de agruparlos con tolerancia absoluta visible. El modo racional evalúa residuos enteros modulares antes de aplicar fase. El modo de retornos usa un intervalo semiabierto [0,beta) mostrado." })}</p>
          <Glossary ariaLabel={t({ en: "Mathematical notation", es: "Notación matemática" })} entries={[
            { term: { en: "α", es: "α" }, definition: { en: "angle step in turns", es: "paso angular en vueltas" } },
            { term: { en: "N", es: "N" }, definition: { en: "number of orbit points", es: "cantidad de puntos de la órbita" } },
            { term: { en: "φ", es: "φ" }, definition: { en: "phase offset", es: "desfase inicial" } },
            { term: { en: "β", es: "β" }, definition: { en: "target interval length", es: "longitud del intervalo objetivo" } },
            { term: { en: "gᵢ", es: "gᵢ" }, definition: { en: "ith sorted circular gap", es: "brecha circular ordenada i-ésima" } },
            { term: { en: "Dₙ", es: "Dₙ" }, definition: { en: "number of distinct gap lengths", es: "cantidad de longitudes de brecha distintas" } },
            { term: { en: "p/q", es: "p/q" }, definition: { en: "exact rational declaration", es: "declaración racional exacta" } },
            { term: { en: "qₖ", es: "qₖ" }, definition: { en: "continued-fraction convergent denominator", es: "denominador de un convergente de fracción continua" } },
            { term: { en: "H₀", es: "H₀" }, definition: { en: "zero-dimensional homology of connected components", es: "homología de dimensión cero de componentes conexas" } },
            { term: { en: "Dₙ*", es: "Dₙ*" }, definition: { en: "star discrepancy of the finite orbit", es: "discrepancia estrella de la órbita finita" } },
          ]} />
          <Equation tex={"g_i=x_{(i+1)}-x_{(i)},\\quad g_{N-1}=1+x_{(0)}-x_{(N-1)}"} caption={t({ en: "Interior gaps and the mandatory wrap gap.", es: "Brechas interiores y brecha de cierre obligatoria." })} />
          <ScientificFigure kind="overview" />
          <Callout variant="honest" title={t({ en: "Compare conventions first", es: "Compare primero las convenciones" })}><span>{t({ en: "Different papers may index N+1 points or use a different endpoint convention. A changed finite table is not automatically a mathematical contradiction.", es: "Distintos artículos pueden indexar N+1 puntos o usar otra convención de extremos. Una tabla finita distinta no implica contradicción matemática." })}</span></Callout>
        </div></DocSection>
      ),
    },
    {
      id: "scope",
      label: t({ en: "Scope", es: "Alcance" }),
      content: (
        <DocSection area="honesty" refs={["mayero2006", "suarez2026", "haynes2014"]} title={t({ en: "Scope of the computed certificate", es: "Alcance del certificado calculado" })}>
        <div className="research-chapter">
          <span className="eyebrow">{t({ en: "CLAIM BOUNDARY", es: "LÍMITE DE LAS AFIRMACIONES" })}</span>
          <p>{t({ en: "The app establishes reproducible finite statements about implemented scenarios: orbit points, circular gaps, length classes, split events, rational approximants, return indices, finite topology thresholds, residuals, and content hashes. For declared irrational rotations it reports whether the computed finite partition satisfies the three-gap and additive relations. Committed artifacts make those statements replayable instead of anecdotal.", es: "La app establece afirmaciones finitas reproducibles sobre escenarios implementados: puntos, brechas, clases, divisiones, aproximantes, retornos, umbrales topológicos, residuos y hashes. Para rotaciones declaradas irracionales informa si la partición satisface las relaciones de tres brechas y aditividad. Los artefactos versionados vuelven reproducibles esas afirmaciones." })}</p>
          <p>{t({ en: "It does not prove irrationality from digits, replace a formal proof, establish a new theorem, transfer the bound to random or farthest-point processes, or implement general persistent homology. The defensible contribution is the synchronized certificate protocol: exact and numerical readings made inspectable under explicit validity boundaries.", es: "No prueba irracionalidad desde dígitos, no reemplaza una demostración formal, no establece un teorema nuevo, no transfiere el límite a procesos aleatorios o de punto más lejano ni implementa homología persistente general. La contribución defendible es el protocolo sincronizado de certificados bajo límites explícitos." })}</p>
          <Equation tex={"\\mathrm{computed\\ agreement}\\;\\not\\Rightarrow\\;\\mathrm{new\\ proof}"} caption={t({ en: "Reproducible computation and proof are deliberately not conflated.", es: "El cálculo reproducible y la prueba no se confunden deliberadamente." })} />
          <ScientificFigure kind="readings" />
          <Callout variant="honest" title={t({ en: "Novelty boundary", es: "Límite de novedad" })}><span>{t({ en: "Formal theorem novelty would require a separately reviewed proof artifact. This release claims a research workbench and reproducibility protocol.", es: "La novedad teórica exigiría un artefacto de prueba revisado por separado. Este release afirma un laboratorio y un protocolo de reproducibilidad." })}</span></Callout>
        </div></DocSection>
      ),
    },
  ];
  return (
    <main className="page-body prose">
      <Tabs tabs={tabs} ariaLabel={t({ en: "Introduction chapters", es: "Capítulos de introducción" })} />
    </main>
  );
}
