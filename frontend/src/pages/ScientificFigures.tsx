import { Figure, useShellLang } from "@fasl-work/caos-app-shell";

export type ScientificFigureKind =
  | "overview"
  | "split"
  | "readings"
  | "farey"
  | "continued"
  | "returns"
  | "symbolic"
  | "lattice"
  | "topology"
  | "pipeline"
  | "contracts"
  | "protocol"
  | "events"
  | "benchmark";

type Copy = { en: string; es: string };

const CAPTIONS: Record<ScientificFigureKind, Copy> = {
  overview: {
    en: "One finite rotation, shown simultaneously as a circular partition, a sorted interval, and a three-length inventory.",
    es: "Una rotación finita, mostrada simultáneamente como partición circular, intervalo ordenado e inventario de tres longitudes.",
  },
  split: {
    en: "Insertion conserves length: one parent arc is replaced by two identified children while every other gap persists.",
    es: "La inserción conserva longitud: un arco padre se reemplaza por dos hijos identificados mientras las demás brechas persisten.",
  },
  readings: {
    en: "The direct certificate is the shared state; arithmetic, symbolic, dynamical, and topological views are synchronized projections.",
    es: "El certificado directo es el estado compartido; las vistas aritméticas, simbólicas, dinámicas y topológicas son proyecciones sincronizadas.",
  },
  farey: {
    en: "Farey neighbours bracket the selected angle and identify a finite combinatorial cell at fixed N.",
    es: "Vecinos de Farey acotan el ángulo seleccionado e identifican una celda combinatoria finita para N fijo.",
  },
  continued: {
    en: "Convergent denominators organise the finite-size event scales; residual bars show |q alpha - p|.",
    es: "Los denominadores convergentes organizan las escalas de eventos finitos; las barras muestran |q alfa - p|.",
  },
  returns: {
    en: "A target interval selects orbit indices; differences between consecutive visits form the dual return-gap word.",
    es: "Un intervalo objetivo selecciona índices orbitales; las diferencias entre visitas consecutivas forman la palabra dual de retornos.",
  },
  symbolic: {
    en: "Geometric gap classes become a cyclic word, while the two-interval exchange exposes the cut-and-translate mechanism.",
    es: "Las clases geométricas se convierten en una palabra cíclica, mientras el intercambio de dos intervalos muestra el mecanismo de corte y traslación.",
  },
  lattice: {
    en: "The active short-vector window changes at event boundaries; highlighted vectors encode the finite gap candidates.",
    es: "La ventana de vectores cortos activos cambia en las fronteras; los vectores destacados codifican las brechas candidatas.",
  },
  topology: {
    en: "Connected components merge exactly at observed circular-gap thresholds in this finite H0 lens.",
    es: "Los componentes conexos se fusionan exactamente en los umbrales de brechas observadas en esta lente H0 finita.",
  },
  pipeline: {
    en: "Named deterministic stages transform declared scenarios into validated, checksummed evidence without training during CI or deployment.",
    es: "Etapas deterministas transforman escenarios declarados en evidencia validada con hash, sin entrenamiento durante CI o despliegue.",
  },
  contracts: {
    en: "Scenario and certificate contracts separate declared hypotheses from computed evidence and validation assertions.",
    es: "Los contratos de escenario y certificado separan hipótesis declaradas de evidencia calculada y aserciones de validación.",
  },
  protocol: {
    en: "Cases are stratified by mathematical regime; grouped evaluation forbids evidence from the same parameter family crossing the boundary.",
    es: "Los casos se estratifican por régimen; la evaluación agrupada impide que evidencia de la misma familia cruce la frontera.",
  },
  events: {
    en: "A finite-size sweep reveals plateaus and event boundaries rather than suggesting a smooth change in gap type.",
    es: "Un barrido de tamaño finito revela mesetas y fronteras, en lugar de sugerir un cambio suave del tipo de brecha.",
  },
  benchmark: {
    en: "The benchmark reports independent invariants and cross-method residuals for every committed case, not a synthetic combined score.",
    es: "El benchmark informa invariantes independientes y residuos entre métodos para cada caso versionado, no un puntaje combinado sintético.",
  },
};

function SvgShell({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <svg
      className="science-figure"
      viewBox="0 0 900 440"
      role="img"
      aria-label={label}
    >
      <defs>
        <marker
          id="sf-arrow"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M0 0L10 5L0 10Z" className="sf-arrow-head" />
        </marker>
        <pattern id="sf-hatch" width="8" height="8" patternUnits="userSpaceOnUse">
          <path d="M-2 2L2-2M0 8L8 0M6 10L10 6" className="sf-hatch" />
        </pattern>
      </defs>
      <rect x="1" y="1" width="898" height="438" rx="18" className="sf-canvas" />
      {children}
    </svg>
  );
}

function Overview({ es }: { es: boolean }) {
  const values = [0, 0.118, 0.236, 0.382, 0.5, 0.618, 0.736, 0.854];
  return (
    <SvgShell label={es ? "Anatomía de una partición de tres brechas" : "Anatomy of a three-gap partition"}>
      <text x="34" y="36" className="sf-title">{es ? "ANATOMÍA DE LA PARTICIÓN FINITA" : "FINITE PARTITION ANATOMY"}</text>
      <text x="34" y="58" className="sf-subtitle">xₙ = {'{'}φ + nα{'}'} · α = (√5 − 1)/2 · N = 8</text>
      <rect x="28" y="82" width="378" height="318" rx="14" className="sf-panel" />
      <circle cx="215" cy="235" r="118" className="sf-ring" />
      {values.map((v, i) => {
        const a = -Math.PI / 2 + v * Math.PI * 2;
        const x = 215 + 118 * Math.cos(a);
        const y = 235 + 118 * Math.sin(a);
        return <g key={v}><line x1="215" y1="235" x2={x} y2={y} className="sf-ray" /><circle cx={x} cy={y} r={i === 0 ? 7 : 5} className={i === 0 ? "sf-point sf-point-origin" : "sf-point"} /><text x={x + (x >= 215 ? 9 : -22)} y={y + (y >= 235 ? 17 : -9)} className="sf-small">x{i}</text></g>;
      })}
      <text x="51" y="112" className="sf-kicker">{es ? "CÍRCULO / ORDEN CÍCLICO" : "CIRCLE / CYCLIC ORDER"}</text>
      <path d="M416 235H453" className="sf-flow" />
      <text x="416" y="220" className="sf-flow-label">{es ? "cortar en 0" : "cut at 0"}</text>
      <rect x="474" y="82" width="398" height="318" rx="14" className="sf-panel" />
      <text x="497" y="112" className="sf-kicker">{es ? "INTERVALO ORDENADO / BRECHAS" : "SORTED INTERVAL / GAPS"}</text>
      <line x1="510" y1="178" x2="840" y2="178" className="sf-axis" />
      {values.map((v, i) => <g key={v}><line x1={510 + v * 330} y1="166" x2={510 + v * 330} y2="190" className="sf-tick" /><text x={510 + v * 330} y="207" textAnchor="middle" className="sf-small">{i}</text></g>)}
      <line x1="840" y1="166" x2="840" y2="190" className="sf-tick" />
      <text x="510" y="226" className="sf-note">{es ? "incluye la brecha de cierre x₇ → 1 → x₀" : "includes wrap gap x₇ → 1 → x₀"}</text>
      {[
        { y: 268, w: 118, cls: "sf-gap-a", name: "a", n: 3 },
        { y: 306, w: 146, cls: "sf-gap-b", name: "b", n: 2 },
        { y: 344, w: 264, cls: "sf-gap-c", name: "c = a + b", n: 3 },
      ].map((g) => <g key={g.name}><rect x="510" y={g.y - 15} width={g.w} height="18" rx="5" className={g.cls} /><text x={510 + g.w + 12} y={g.y} className="sf-label">{g.name}</text><text x="804" y={g.y} className="sf-mono">× {g.n}</text></g>)}
      <rect x="730" y="247" width="115" height="114" rx="10" className="sf-valid-box" />
      <text x="746" y="272" className="sf-kicker">{es ? "CERTIFICADO" : "CERTIFICATE"}</text>
      <text x="746" y="300" className="sf-value">D₈ = 3</text>
      <text x="746" y="326" className="sf-label">c = a + b</text>
      <text x="746" y="349" className="sf-good-text">Σgᵢ = 1 ✓</text>
    </SvgShell>
  );
}

function Split({ es }: { es: boolean }) {
  return (
    <SvgShell label={es ? "Genealogía de división incremental" : "Incremental split genealogy"}>
      <text x="34" y="36" className="sf-title">{es ? "GENEALOGÍA: UN ARCO PADRE, DOS HIJOS" : "GENEALOGY: ONE PARENT ARC, TWO CHILDREN"}</text>
      <text x="34" y="58" className="sf-subtitle">gₚ = gₗ + gᵣ · stable gap identifiers preserve lineage</text>
      <rect x="34" y="88" width="340" height="286" rx="14" className="sf-panel" />
      <text x="55" y="117" className="sf-kicker">{es ? "ANTES DE INSERTAR xₙ" : "BEFORE INSERTING xₙ"}</text>
      <line x1="76" y1="213" x2="332" y2="213" className="sf-gap-parent" />
      <circle cx="76" cy="213" r="7" className="sf-point" /><circle cx="332" cy="213" r="7" className="sf-point" />
      <path d="M76 190Q204 116 332 190" className="sf-arc-parent" />
      <text x="204" y="145" textAnchor="middle" className="sf-value">gₚ = 0.236068</text>
      <text x="76" y="247" className="sf-mono">gap:g-07</text>
      <rect x="62" y="282" width="284" height="58" rx="9" className="sf-neutral-box" />
      <text x="80" y="307" className="sf-label">{es ? "arco vacío seleccionado" : "selected empty arc"}</text>
      <text x="80" y="329" className="sf-note">{es ? "los demás identificadores no cambian" : "all other identifiers remain stable"}</text>
      <path d="M386 230H474" className="sf-flow sf-flow-accent" />
      <text x="430" y="211" textAnchor="middle" className="sf-flow-label">{es ? "insertar xₙ" : "insert xₙ"}</text>
      <rect x="486" y="88" width="380" height="286" rx="14" className="sf-panel" />
      <text x="507" y="117" className="sf-kicker">{es ? "DESPUÉS / CONSERVACIÓN" : "AFTER / CONSERVATION"}</text>
      <line x1="526" y1="213" x2="826" y2="213" className="sf-axis" />
      <circle cx="526" cy="213" r="7" className="sf-point" /><circle cx="714" cy="213" r="9" className="sf-point-new" /><circle cx="826" cy="213" r="7" className="sf-point" />
      <path d="M526 190Q620 132 714 190" className="sf-gap-a-stroke" /><path d="M714 190Q770 152 826 190" className="sf-gap-b-stroke" />
      <text x="620" y="151" textAnchor="middle" className="sf-label">gₗ = 0.145898</text>
      <text x="770" y="166" textAnchor="middle" className="sf-label">gᵣ = 0.090170</text>
      <text x="714" y="247" textAnchor="middle" className="sf-mono">point:p-{es ? "nuevo" : "new"}</text>
      <rect x="526" y="282" width="300" height="58" rx="9" className="sf-valid-box" />
      <text x="546" y="307" className="sf-good-text">0.236068 = 0.145898 + 0.090170</text>
      <text x="546" y="329" className="sf-note">{es ? "residuo de conservación < 10⁻¹²" : "conservation residual < 10⁻¹²"}</text>
    </SvgShell>
  );
}

function Readings({ es }: { es: boolean }) {
  const nodes = [
    [88, 104, "Farey", es ? "celda α–N" : "α–N cell"],
    [344, 86, es ? "Fracción continua" : "Continued fraction", "pₖ/qₖ"],
    [658, 104, es ? "Retornos" : "Returns", "rⱼ = nⱼ₊₁ − nⱼ"],
    [88, 300, es ? "Palabra cíclica" : "Cyclic word", "A B C A …"],
    [344, 322, es ? "Retículo" : "Lattice", "SL(2,ℤ)"],
    [658, 300, "H₀", es ? "umbrales de fusión" : "merge thresholds"],
  ];
  return (
    <SvgShell label={es ? "Lecturas sincronizadas del certificado" : "Synchronized certificate readings"}>
      <text x="34" y="36" className="sf-title">{es ? "UN CERTIFICADO, SEIS PROYECCIONES" : "ONE CERTIFICATE, SIX PROJECTIONS"}</text>
      <rect x="324" y="172" width="252" height="104" rx="16" className="sf-primary-box" />
      <text x="450" y="201" textAnchor="middle" className="sf-kicker">{es ? "ORÁCULO DIRECTO" : "DIRECT ORACLE"}</text>
      <text x="450" y="230" textAnchor="middle" className="sf-value">sort({'{'}φ+nα{'}'}) → gaps</text>
      <text x="450" y="254" textAnchor="middle" className="sf-mono">certificate.sha256</text>
      {nodes.map(([x, y, title, sub], i) => {
        const targetX = Number(x) < 300 ? 324 : Number(x) > 600 ? 576 : 450;
        const targetY = Number(y) < 150 ? 172 : 276;
        return <g key={String(title)}><path d={`M${Number(x)+76} ${Number(y)+54} Q450 ${Number(y)<150?135:305} ${targetX} ${targetY}`} className={i % 2 ? "sf-link sf-link-secondary" : "sf-link"} /><rect x={x} y={y} width="154" height="74" rx="11" className="sf-panel sf-panel-compact" /><text x={Number(x)+14} y={Number(y)+28} className="sf-label">{title}</text><text x={Number(x)+14} y={Number(y)+52} className="sf-mono">{sub}</text></g>;
      })}
      <rect x="34" y="394" width="832" height="24" rx="7" className="sf-boundary-band" />
      <text x="450" y="411" textAnchor="middle" className="sf-note">{es ? "Las proyecciones explican el mismo estado; ninguna reemplaza la verificación directa de la partición." : "The projections explain the same state; none replaces direct partition verification."}</text>
    </SvgShell>
  );
}

function Farey({ es }: { es: boolean }) {
  return (
    <SvgShell label={es ? "Celda de Farey activa" : "Active Farey cell"}>
      <text x="34" y="36" className="sf-title">{es ? "ESQUELETO DE FAREY A N FIJO" : "FAREY SKELETON AT FIXED N"}</text>
      <text x="34" y="58" className="sf-subtitle">a/b &lt; α &lt; c/d · bc − ad = 1 · b + d &gt; N</text>
      <rect x="42" y="86" width="816" height="292" rx="14" className="sf-plot" />
      {[0,1,2,3,4].map(i => <line key={i} x1="92" y1={125+i*52} x2="822" y2={125+i*52} className="sf-grid" />)}
      {[0,1,2,3,4,5,6].map(i => <line key={i} x1={92+i*121.5} y1="112" x2={92+i*121.5} y2="342" className="sf-grid" />)}
      <line x1="92" y1="342" x2="822" y2="342" className="sf-axis" /><line x1="92" y1="112" x2="92" y2="342" className="sf-axis" />
      <text x="822" y="366" textAnchor="end" className="sf-axis-label">α</text><text x="70" y="122" className="sf-axis-label">N</text>
      <path d="M116 326L230 276L346 230L470 188L598 151L780 118" className="sf-stair sf-gap-a-stroke" />
      <path d="M116 300L230 255L346 212L470 174L598 143L780 130" className="sf-stair sf-gap-b-stroke" />
      <path d="M116 270L230 223L346 181L470 150L598 126L780 112" className="sf-stair sf-gap-c-stroke" />
      <rect x="401" y="112" width="116" height="230" className="sf-cell" />
      <line x1="459" y1="112" x2="459" y2="342" className="sf-cursor" />
      <text x="459" y="102" textAnchor="middle" className="sf-accent-text">α = 0.618…</text>
      <text x="405" y="329" className="sf-small">8/13</text><text x="492" y="329" className="sf-small">5/8</text>
      <rect x="570" y="232" width="234" height="82" rx="10" className="sf-neutral-box" />
      <text x="588" y="257" className="sf-kicker">{es ? "CELDA ACTIVA" : "ACTIVE CELL"}</text>
      <text x="588" y="282" className="sf-value">8/13 &lt; α &lt; 5/8</text>
      <text x="588" y="303" className="sf-note">13·5 − 8·8 = 1</text>
      <text x="104" y="397" className="sf-gap-a-text">a · ‖qₖα‖</text><text x="322" y="397" className="sf-gap-b-text">b · ‖qₖ₋₁α‖</text><text x="550" y="397" className="sf-gap-c-text">c = a + b</text>
    </SvgShell>
  );
}

function Continued({ es }: { es: boolean }) {
  const rows = [[1,1,0.382],[2,1,0.236],[3,2,0.146],[5,3,0.090],[8,5,0.056],[13,8,0.034]];
  return (
    <SvgShell label={es ? "Convergentes y escalas de evento" : "Convergents and event scales"}>
      <text x="34" y="36" className="sf-title">{es ? "FRACCIÓN CONTINUA → ESCALAS FINITAS" : "CONTINUED FRACTION → FINITE SCALES"}</text>
      <text x="34" y="59" className="sf-subtitle">α = [0; 1, 1, 1, …] · pₖ = aₖpₖ₋₁ + pₖ₋₂ · qₖ = aₖqₖ₋₁ + qₖ₋₂</text>
      <rect x="36" y="86" width="354" height="304" rx="14" className="sf-panel" />
      <text x="58" y="115" className="sf-kicker">{es ? "RECURRENCIA ENTERA" : "INTEGER RECURRENCE"}</text>
      <text x="65" y="151" className="sf-table-head">k</text><text x="126" y="151" className="sf-table-head">pₖ/qₖ</text><text x="244" y="151" className="sf-table-head">|qₖα−pₖ|</text>
      {rows.map((r,i)=><g key={r[0]}><line x1="58" y1={165+i*34} x2="366" y2={165+i*34} className="sf-grid" /><text x="68" y={188+i*34} className="sf-mono">{i}</text><text x="126" y={188+i*34} className="sf-label">{r[1]}/{r[0]}</text><rect x="244" y={176+i*34} width={r[2]*250} height="11" rx="4" className={i%2?"sf-gap-b":"sf-gap-a"}/><text x="354" y={188+i*34} textAnchor="end" className="sf-small">{r[2].toFixed(3)}</text></g>)}
      <rect x="426" y="86" width="438" height="304" rx="14" className="sf-plot" />
      <text x="448" y="115" className="sf-kicker">{es ? "EVENTOS AL VARIAR N" : "EVENTS AS N CHANGES"}</text>
      <line x1="466" y1="326" x2="832" y2="326" className="sf-axis" />
      {[3,5,8,13,21,34].map((q,i)=><g key={q}><line x1={480+i*68} y1="149" x2={480+i*68} y2="326" className="sf-event-line"/><circle cx={480+i*68} cy={326} r="5" className="sf-point-new"/><text x={480+i*68} y="349" textAnchor="middle" className="sf-mono">{q}</text><text x={480+i*68} y={136+(i%2)*22} textAnchor="middle" className="sf-small">q{i+2}</text></g>)}
      <path d="M480 292H548V258H616V222H684V184H752V144H820V112" className="sf-stair sf-accent-stroke" />
      <text x="646" y="378" textAnchor="middle" className="sf-axis-label">N</text>
      <text x="448" y="176" className="sf-note">{es ? "mesetas combinatorias" : "combinatorial plateaus"}</text>
    </SvgShell>
  );
}

function Returns({ es }: { es: boolean }) {
  const visits = [0,2,5,8,10,13,16];
  return (
    <SvgShell label={es ? "Retornos a un intervalo objetivo" : "Returns to a target interval"}>
      <text x="34" y="36" className="sf-title">{es ? "PROBLEMA DUAL: VISITAS A [0, β)" : "DUAL PROBLEM: VISITS TO [0, β)"}</text>
      <text x="34" y="59" className="sf-subtitle">nⱼ : {'{'}φ+nⱼα{'}'} &lt; β · rⱼ = nⱼ₊₁ − nⱼ</text>
      <rect x="36" y="84" width="304" height="300" rx="14" className="sf-panel" />
      <circle cx="188" cy="231" r="108" className="sf-ring" />
      <path d="M188 231L188 123A108 108 0 0 1 278 171Z" className="sf-target-sector" />
      <text x="243" y="151" className="sf-accent-text">[0, β)</text>
      {[0,.18,.31,.49,.62,.78,.9].map((v,i)=>{const a=-Math.PI/2+v*Math.PI*2;return <g key={v}><circle cx={188+108*Math.cos(a)} cy={231+108*Math.sin(a)} r={i<2?7:4} className={i<2?"sf-point-new":"sf-point"}/><text x={188+91*Math.cos(a)} y={236+91*Math.sin(a)} textAnchor="middle" className="sf-small">{visits[i]}</text></g>})}
      <rect x="374" y="84" width="490" height="300" rx="14" className="sf-plot" />
      <text x="398" y="113" className="sf-kicker">{es ? "ÍNDICES SELECCIONADOS Y SALTOS" : "SELECTED INDICES AND JUMPS"}</text>
      <line x1="410" y1="200" x2="830" y2="200" className="sf-axis" />
      {visits.map((n,i)=><g key={n}><line x1={420+n*24} y1="184" x2={420+n*24} y2="216" className="sf-tick"/><circle cx={420+n*24} cy="200" r="5" className="sf-point-new"/><text x={420+n*24} y="239" textAnchor="middle" className="sf-mono">{n}</text>{i<visits.length-1&&<><path d={`M${426+n*24} 171Q${420+(n+visits[i+1])*12} 138 ${414+visits[i+1]*24} 171`} className={i%2?"sf-gap-b-stroke":"sf-gap-a-stroke"}/><text x={420+(n+visits[i+1])*12} y="140" textAnchor="middle" className="sf-label">r={visits[i+1]-n}</text></>}</g>)}
      <rect x="410" y="279" width="420" height="70" rx="10" className="sf-neutral-box" />
      <text x="430" y="306" className="sf-label">{es ? "palabra de retorno" : "return word"}</text>
      <text x="430" y="334" className="sf-value">2 · 3 · 3 · 2 · 3 · 3</text>
      <text x="724" y="334" className="sf-good-text">Dᵣ = 2</text>
    </SvgShell>
  );
}

function Symbolic({ es }: { es: boolean }) {
  const letters = ["A","C","B","A","B","C","A","C","B","A"];
  return (
    <SvgShell label={es ? "Palabra cíclica e intercambio de intervalos" : "Cyclic word and interval exchange"}>
      <text x="34" y="36" className="sf-title">{es ? "DE GEOMETRÍA A PALABRA Y 2-IET" : "FROM GEOMETRY TO WORD AND 2-IET"}</text>
      <rect x="36" y="78" width="828" height="112" rx="14" className="sf-panel" />
      <text x="58" y="107" className="sf-kicker">{es ? "PALABRA DE BRECHAS EN ORDEN CÍCLICO" : "GAP WORD IN CYCLIC ORDER"}</text>
      {letters.map((l,i)=><g key={i}><rect x={64+i*76} y="128" width="58" height="38" rx="8" className={l==="A"?"sf-gap-a":l==="B"?"sf-gap-b":"sf-gap-c"}/><text x={93+i*76} y="153" textAnchor="middle" className="sf-letter">{l}</text>{i<letters.length-1&&<path d={`M${122+i*76} 147H${137+i*76}`} className="sf-link"/>}</g>)}
      <rect x="36" y="218" width="828" height="174" rx="14" className="sf-plot" />
      <text x="58" y="247" className="sf-kicker">{es ? "ROTACIÓN COMO INTERCAMBIO DE DOS INTERVALOS" : "ROTATION AS A TWO-INTERVAL EXCHANGE"}</text>
      <rect x="78" y="278" width="430" height="38" className="sf-gap-a"/><rect x="508" y="278" width="278" height="38" className="sf-gap-b"/>
      <text x="293" y="303" textAnchor="middle" className="sf-letter">I₁ · 1−α</text><text x="647" y="303" textAnchor="middle" className="sf-letter">I₂ · α</text>
      <path d="M293 326C293 365 647 365 647 326" className="sf-flow"/><path d="M647 326C647 365 293 365 293 326" className="sf-flow sf-flow-secondary"/>
      <text x="470" y="378" textAnchor="middle" className="sf-note">{es ? "cortar · trasladar · reensamblar sin estirar" : "cut · translate · reassemble without stretching"}</text>
    </SvgShell>
  );
}

function Lattice({ es }: { es: boolean }) {
  const pts=[] as Array<[number,number]>; for(let i=-4;i<=4;i++)for(let j=-3;j<=3;j++)pts.push([i,j]);
  return (
    <SvgShell label={es ? "Ventana de retículo y vectores activos" : "Lattice window and active vectors"}>
      <text x="34" y="36" className="sf-title">{es ? "LENTE HOMOGÉNEA: VECTORES CORTOS ACTIVOS" : "HOMOGENEOUS LENS: ACTIVE SHORT VECTORS"}</text>
      <text x="34" y="58" className="sf-subtitle">gₜu_αℤ² · shortest positive horizontal components encode candidates</text>
      <rect x="42" y="82" width="540" height="318" rx="14" className="sf-plot" />
      {[0,1,2,3,4,5,6,7,8].map(i=><line key={'v'+i} x1={90+i*56} y1="108" x2={90+i*56} y2="374" className="sf-grid"/>)}
      {[0,1,2,3,4,5,6].map(i=><line key={'h'+i} x1="76" y1={119+i*41} x2="554" y2={119+i*41} className="sf-grid"/>)}
      <line x1="76" y1="247" x2="554" y2="247" className="sf-axis"/><line x1="315" y1="102" x2="315" y2="382" className="sf-axis"/>
      {pts.map(([i,j])=>{const x=315+i*53+j*17,y=247-j*41;const active=(i===1&&Math.abs(j)<=1)||(i===2&&j===-1);return <circle key={`${i}-${j}`} cx={x} cy={y} r={active?7:3} className={active?"sf-lattice-active":"sf-lattice-dot"}/>})}
      <path d="M315 247L385 206M315 247L421 288M315 247L368 288" className="sf-vector"/>
      <rect x="614" y="82" width="244" height="318" rx="14" className="sf-panel" />
      <text x="636" y="112" className="sf-kicker">{es ? "VENTANA ACTIVA" : "ACTIVE WINDOW"}</text>
      <rect x="637" y="139" width="198" height="66" rx="9" className="sf-primary-box"/>
      <text x="653" y="165" className="sf-mono">v₁ = (qₖ, qₖα−pₖ)</text><text x="653" y="188" className="sf-label">‖v₁‖ → a</text>
      <rect x="637" y="220" width="198" height="66" rx="9" className="sf-secondary-box"/>
      <text x="653" y="246" className="sf-mono">v₂ = (qₖ₋₁, …)</text><text x="653" y="269" className="sf-label">‖v₂‖ → b</text>
      <rect x="637" y="301" width="198" height="66" rx="9" className="sf-valid-box"/>
      <text x="653" y="327" className="sf-value">a + b → c</text><text x="653" y="351" className="sf-good-text">direct residual ✓</text>
    </SvgShell>
  );
}

function Topology({ es }: { es: boolean }) {
  const deaths=[.09,.09,.146,.146,.146,.236,.236,.236];
  return (
    <SvgShell label={es ? "Filtración H cero de la órbita finita" : "Finite orbit H zero filtration"}>
      <text x="34" y="36" className="sf-title">{es ? "H₀ FINITA: UMBRALES DE FUSIÓN OBSERVADOS" : "FINITE H₀: OBSERVED MERGE THRESHOLDS"}</text>
      <rect x="36" y="82" width="392" height="310" rx="14" className="sf-panel" />
      <text x="58" y="112" className="sf-kicker">{es ? "BARRAS DE COMPONENTES" : "COMPONENT BARS"}</text>
      <line x1="94" y1="340" x2="398" y2="340" className="sf-axis"/>
      {deaths.map((d,i)=><g key={i}><line x1="94" y1={145+i*23} x2={94+d*1100} y2={145+i*23} className={d<.1?"sf-gap-a-stroke":d<.2?"sf-gap-b-stroke":"sf-gap-c-stroke"}/><circle cx={94+d*1100} cy={145+i*23} r="4" className="sf-point-new"/></g>)}
      {[0,.09,.146,.236].map(v=><g key={v}><line x1={94+v*1100} y1="132" x2={94+v*1100} y2="340" className="sf-event-line"/><text x={94+v*1100} y="362" textAnchor="middle" className="sf-small">{v.toFixed(3)}</text></g>)}
      <rect x="466" y="82" width="398" height="310" rx="14" className="sf-plot" />
      <text x="488" y="112" className="sf-kicker">β₀(r) · {es ? "COMPONENTES VIVOS" : "LIVE COMPONENTS"}</text>
      <line x1="514" y1="338" x2="830" y2="338" className="sf-axis"/><line x1="514" y1="136" x2="514" y2="338" className="sf-axis"/>
      <path d="M514 154H612V200H675V246H774V292H830" className="sf-stair sf-accent-stroke"/>
      <text x="502" y="158" textAnchor="end" className="sf-small">8</text><text x="502" y="204" textAnchor="end" className="sf-small">5</text><text x="502" y="250" textAnchor="end" className="sf-small">3</text><text x="502" y="296" textAnchor="end" className="sf-small">1</text>
      <text x="672" y="372" textAnchor="middle" className="sf-axis-label">r</text>
      <rect x="568" y="270" width="202" height="42" rx="8" className="sf-valid-box"/><text x="669" y="296" textAnchor="middle" className="sf-good-text">β₀ → 1 {es ? "al cerrar" : "at closure"}</text>
    </SvgShell>
  );
}

function Pipeline({ es }: { es: boolean }) {
  const stages=["ingest","preprocess","partition","features","infer","evaluate","export","validate"];
  return (
    <SvgShell label={es ? "Pipeline científico determinista" : "Deterministic scientific pipeline"}>
      <text x="34" y="36" className="sf-title">{es ? "PIPELINE DE REFERENCIA Y LÍMITE DE DESPLIEGUE" : "REFERENCE PIPELINE AND DEPLOYMENT BOUNDARY"}</text>
      <rect x="34" y="76" width="832" height="236" rx="14" className="sf-panel" />
      <text x="54" y="105" className="sf-kicker">OFFLINE · Python · data_pipeline/gaptheo/stages/</text>
      {stages.map((s,i)=>{const row=Math.floor(i/4),col=i%4,x=58+col*199,y=132+row*86;return <g key={s}><rect x={x} y={y} width="156" height="55" rx="9" className={s==="validate"?"sf-valid-box":i<3?"sf-primary-box":"sf-neutral-box"}/><text x={x+14} y={y+23} className="sf-label">{s}</text><text x={x+14} y={y+43} className="sf-mono">stages/{s}.py</text>{i<7&&<path d={col===3?`M${x+78} ${y+55}V${y+76}H${58+78}`:`M${x+156} ${y+28}H${x+190}`} className="sf-flow"/>}</g>})}
      <line x1="34" y1="330" x2="866" y2="330" className="sf-deploy-boundary" />
      <text x="450" y="350" textAnchor="middle" className="sf-warn-text">{es ? "CI/CD valida artefactos; nunca recalcula evidencia" : "CI/CD validates artifacts; it never recomputes evidence"}</text>
      <rect x="34" y="369" width="406" height="49" rx="10" className="sf-secondary-box"/><text x="54" y="392" className="sf-label">WEB · core/gapEngine.ts</text><text x="244" y="392" className="sf-note">{es ? "recálculo acotado" : "bounded recompute"}</text>
      <rect x="460" y="369" width="406" height="49" rx="10" className="sf-valid-box"/><text x="480" y="392" className="sf-label">REPLAY · artifacts/*.json</text><text x="690" y="392" className="sf-note">SHA-256 · {es ? "solo lectura" : "read-only"}</text>
    </SvgShell>
  );
}

function Contracts({ es }: { es: boolean }) {
  return (
    <SvgShell label={es ? "Contratos de escenario y certificado" : "Scenario and certificate contracts"}>
      <text x="34" y="36" className="sf-title">{es ? "DOS CONTRATOS, UNA FRONTERA DE HONESTIDAD" : "TWO CONTRACTS, ONE HONESTY BOUNDARY"}</text>
      <rect x="38" y="78" width="342" height="306" rx="14" className="sf-primary-box" />
      <text x="60" y="108" className="sf-kicker">SCENARIO · {es ? "DECLARADO" : "DECLARED"}</text>
      {["id / category","alpha.value + declaration","rational p / q","N · phase · beta","allocator · seed","endpoint convention"].map((s,i)=><g key={s}><circle cx="70" cy={148+i*35} r="4" className="sf-point-new"/><text x="86" y={152+i*35} className="sf-mono">{s}</text></g>)}
      <path d="M392 230H500" className="sf-flow sf-flow-accent"/><text x="446" y="214" textAnchor="middle" className="sf-flow-label">computeCertificate()</text>
      <rect x="518" y="78" width="344" height="306" rx="14" className="sf-valid-box" />
      <text x="540" y="108" className="sf-kicker">CERTIFICATE · {es ? "CALCULADO" : "COMPUTED"}</text>
      {["points[] + stable ids","gaps[] + parent ids","length groups + counts","Farey / CF / returns / H0","residuals + theorem status","methodVersion + sha256"].map((s,i)=><g key={s}><circle cx="550" cy={148+i*35} r="4" className="sf-good-point"/><text x="566" y={152+i*35} className="sf-mono">{s}</text></g>)}
      <rect x="184" y="397" width="532" height="27" rx="7" className="sf-boundary-band"/><text x="450" y="416" textAnchor="middle" className="sf-note">{es ? "La declaración de irracionalidad nunca se infiere desde un decimal." : "An irrationality declaration is never inferred from a decimal."}</text>
    </SvgShell>
  );
}

function Protocol({ es }: { es: boolean }) {
  return (
    <SvgShell label={es ? "Protocolo estratificado y antipatrón" : "Stratified protocol and anti-pattern"}>
      <text x="34" y="36" className="sf-title">{es ? "PROTOCOLO DE COBERTURA Y CONTROL ADVERSARIAL" : "COVERAGE PROTOCOL AND ADVERSARIAL CONTROL"}</text>
      <rect x="36" y="76" width="528" height="330" rx="14" className="sf-panel" />
      <text x="58" y="106" className="sf-kicker">{es ? "PARTICIÓN POR RÉGIMEN" : "REGIME PARTITION"}</text>
      {[{y:132,t:es?"Irracional / teorema":"Irrational / theorem",c:"sf-valid-box"},{y:190,t:es?"Racional / colisión":"Rational / collision",c:"sf-boundary-box"},{y:248,t:es?"Casi racional / condición":"Near-rational / conditioning",c:"sf-secondary-box"},{y:306,t:es?"Contrastes / fuera de régimen":"Contrasts / out of regime",c:"sf-neutral-box"}].map((r,i)=><g key={r.t}><rect x="62" y={r.y} width="190" height="42" rx="8" className={r.c}/><text x="78" y={r.y+26} className="sf-label">{r.t}</text><path d={`M252 ${r.y+21}H330`} className="sf-flow"/><rect x="342" y={r.y} width="188" height="42" rx="8" className="sf-panel sf-panel-compact"/><text x="358" y={r.y+19} className="sf-mono">{["golden · sqrt2 · pi","1/7 · 5/13","1/7 + ε","random · farthest"][i]}</text><text x="358" y={r.y+35} className="sf-small">{es?"casos versionados":"versioned cases"}</text></g>)}
      <rect x="596" y="76" width="268" height="150" rx="14" className="sf-valid-box" />
      <text x="618" y="106" className="sf-kicker">{es ? "PERMITIDO" : "ALLOWED"}</text>
      <text x="618" y="137" className="sf-label">{es ? "oráculos independientes" : "independent oracles"}</text><text x="618" y="164" className="sf-mono">direct ↔ Farey ↔ CF</text><text x="618" y="191" className="sf-good-text">same scenario id · residual</text>
      <rect x="596" y="256" width="268" height="150" rx="14" className="sf-bad-box" />
      <text x="618" y="286" className="sf-kicker">{es ? "PROHIBIDO" : "FORBIDDEN"}</text>
      <text x="618" y="317" className="sf-label">{es ? "copiar la misma salida" : "copy the same output"}</text><text x="618" y="344" className="sf-mono">artifact → artifact</text><path d="M618 303L832 375M832 303L618 375" className="sf-bad-cross"/><text x="618" y="388" className="sf-bad-text">{es ? "sin prueba independiente" : "no independent check"}</text>
    </SvgShell>
  );
}

function Events({ es }: { es: boolean }) {
  const grid=[[2,2,3,3,3,2,2,3,3,3,2,2],[2,3,3,3,2,2,3,3,3,2,2,3],[3,3,3,2,2,3,3,3,2,2,3,3],[3,3,2,2,3,3,3,2,2,3,3,3],[3,2,2,3,3,3,2,2,3,3,3,2],[2,2,3,3,3,2,2,3,3,3,2,2]];
  return (
    <SvgShell label={es ? "Mapa de eventos en alfa y N" : "Event map over alpha and N"}>
      <text x="34" y="36" className="sf-title">{es ? "MAPA DE REGÍMENES FINITOS: Dₙ(α)" : "FINITE REGIME MAP: Dₙ(α)"}</text>
      <rect x="50" y="78" width="612" height="322" rx="14" className="sf-plot" />
      {grid.map((row,r)=>row.map((v,c)=><rect key={`${r}-${c}`} x={96+c*43} y={112+r*40} width="40" height="37" rx="4" className={v===2?"sf-cell-two":"sf-cell-three"}/>))}
      <line x1="96" y1="359" x2="612" y2="359" className="sf-axis"/><line x1="96" y1="112" x2="96" y2="359" className="sf-axis"/>
      <text x="354" y="387" textAnchor="middle" className="sf-axis-label">α</text><text x="76" y="238" textAnchor="middle" transform="rotate(-90 76 238)" className="sf-axis-label">N</text>
      {[2,5,8,13,21,34].map((n,i)=><text key={n} x="87" y={136+i*40} textAnchor="end" className="sf-small">{n}</text>)}
      <path d="M160 112L160 349M332 112L332 349M504 112L504 349" className="sf-event-boundaries"/>
      <rect x="698" y="78" width="166" height="322" rx="14" className="sf-panel"/>
      <text x="718" y="110" className="sf-kicker">{es ? "LEYENDA" : "LEGEND"}</text>
      <rect x="720" y="139" width="30" height="22" rx="4" className="sf-cell-two"/><text x="765" y="155" className="sf-label">Dₙ = 2</text>
      <rect x="720" y="180" width="30" height="22" rx="4" className="sf-cell-three"/><text x="765" y="196" className="sf-label">Dₙ = 3</text>
      <line x1="720" y1="239" x2="752" y2="239" className="sf-event-boundaries"/><text x="765" y="244" className="sf-label">{es ? "evento" : "event"}</text>
      <text x="718" y="292" className="sf-note">{es ? "las fronteras" : "boundaries"}</text><text x="718" y="312" className="sf-note">{es ? "siguen celdas" : "follow Farey"}</text><text x="718" y="332" className="sf-note">Farey / qₖ</text>
    </SvgShell>
  );
}

function Benchmark({ es }: { es: boolean }) {
  const rows=[{n:"partition sum",v:.98,c:"sf-good-bar"},{n:"three-gap bound",v:1,c:"sf-good-bar"},{n:"additive residual",v:.94,c:"sf-accent-bar"},{n:"Farey agreement",v:.91,c:"sf-accent-bar"},{n:"hash integrity",v:1,c:"sf-good-bar"}];
  return (
    <SvgShell label={es ? "Matriz de invariantes del benchmark" : "Benchmark invariant matrix"}>
      <text x="34" y="36" className="sf-title">{es ? "EVIDENCIA SEPARADA, SIN PUNTAJE COMBINADO" : "SEPARATE EVIDENCE, NO COMBINED SCORE"}</text>
      <rect x="36" y="78" width="570" height="326" rx="14" className="sf-plot" />
      <text x="58" y="108" className="sf-kicker">{es ? "COBERTURA DE 12 CASOS" : "12-CASE COVERAGE"}</text>
      {rows.map((r,i)=><g key={r.n}><text x="64" y={151+i*49} className="sf-label">{r.n}</text><rect x="232" y={134+i*49} width="326" height="22" rx="6" className="sf-track"/><rect x="232" y={134+i*49} width={326*r.v} height="22" rx="6" className={r.c}/><text x="566" y={151+i*49} textAnchor="end" className="sf-mono">{i===2?"< 1e−12":i===3?"11/12":"12/12"}</text></g>)}
      <rect x="638" y="78" width="226" height="326" rx="14" className="sf-panel" />
      <text x="660" y="108" className="sf-kicker">{es ? "PROCEDENCIA" : "PROVENANCE"}</text>
      {["scenarioId","methodVersion","sourceRefs","tolerance","sha256"].map((s,i)=><g key={s}><circle cx="670" cy={148+i*42} r="4" className="sf-good-point"/><text x="684" y={152+i*42} className="sf-mono">{s}</text></g>)}
      <rect x="660" y="354" width="180" height="28" rx="7" className="sf-valid-box"/><text x="750" y="373" textAnchor="middle" className="sf-good-text">{es ? "artefacto verificado" : "artifact verified"}</text>
    </SvgShell>
  );
}

export function ScientificFigure({ kind }: { kind: ScientificFigureKind }) {
  const es = useShellLang() === "es";
  const content = {
    overview: <Overview es={es} />,
    split: <Split es={es} />,
    readings: <Readings es={es} />,
    farey: <Farey es={es} />,
    continued: <Continued es={es} />,
    returns: <Returns es={es} />,
    symbolic: <Symbolic es={es} />,
    lattice: <Lattice es={es} />,
    topology: <Topology es={es} />,
    pipeline: <Pipeline es={es} />,
    contracts: <Contracts es={es} />,
    protocol: <Protocol es={es} />,
    events: <Events es={es} />,
    benchmark: <Benchmark es={es} />,
  }[kind];
  return <Figure caption={es ? CAPTIONS[kind].es : CAPTIONS[kind].en}>{content}</Figure>;
}
