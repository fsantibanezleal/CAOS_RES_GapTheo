import { useMemo, useState, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import {
  AppShell,
  Callout,
  CaseSelector,
  Cite,
  CitationsProvider,
  Equation,
  InlineMath,
  Refs,
  SubTabs,
  Tabs,
  usePausedViz,
  useShellLang,
} from "@fasl-work/caos-app-shell";
import {
  Activity,
  Aperture,
  ArrowDownRight,
  CircleDot,
  Dna,
  Gauge,
  GitBranch,
  Grid3X3,
  Info,
  Layers3,
  Pause,
  Play,
  RefreshCcw,
  SlidersHorizontal,
  Sparkles,
  Target,
  Waypoints,
} from "lucide-react";
import {
  type Certificate,
  type Scenario,
  computeCertificate,
  frac,
  gapCountHistory,
  polar,
  starDiscrepancy,
} from "./core/gapEngine";
import { architecture } from "./architecture";
import { CITATIONS } from "./data/citations";
import scenarioData from "./data/scenarios.json";
import { ResearchRoute } from "./pages/ResearchPages";

type ScenarioPreset = Scenario & {
  id: string;
  name: string;
  nameEs: string;
  category: string;
  expression: string;
  anchor: string;
};
const presets = scenarioData as ScenarioPreset[];
const CATEGORY_ES: Record<string, string> = {
  "Irrational rotations": "Rotaciones irracionales",
  "Transcendental rotations": "Rotaciones trascendentes",
  "Phase and finite size": "Fase y tamaño finito",
  "Numerical conditioning": "Condicionamiento numérico",
  "Rational boundaries": "Fronteras racionales",
  "Process contrasts": "Contrastes de proceso",
};
const scenarioFromPreset = ({
  id: _id,
  name: _name,
  nameEs: _nameEs,
  category: _category,
  expression: _expression,
  anchor: _anchor,
  ...scenario
}: ScenarioPreset): Scenario => scenario;
const initialScenario: Scenario = scenarioFromPreset(presets[0]);

function formatNumber(value: number, digits = 5): string {
  return Number.isFinite(value) ? value.toFixed(digits) : "n/a";
}

function Field({
  label,
  value,
  onChange,
  min,
  max,
  step,
  suffix,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  suffix?: string;
}) {
  return (
    <label className="field">
      <span>
        {label}
        <b>
          {formatNumber(value, step < 0.01 ? 4 : 2)}
          {suffix ?? ""}
        </b>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}

function Segmented({
  value,
  options,
  onChange,
}: {
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
}) {
  return (
    <div className="segmented" role="group">
      {options.map((option) => (
        <button
          key={option.value}
          className={value === option.value ? "active" : ""}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function StatusBadge({ certificate }: { certificate: Certificate }) {
  const es = useShellLang() === "es";
  const label = (
    es
      ? {
          certified: "CERTIFICADO",
          boundary: "FRONTERA",
          contrast: "CONTRASTE",
          warning: "ADVERTENCIA",
        }
      : {
          certified: "CERTIFIED",
          boundary: "BOUNDARY",
          contrast: "CONTRAST",
          warning: "WARNING",
        }
  )[certificate.theoremStatus];
  return (
    <span className={"status-badge " + certificate.theoremStatus}>
      <i />
      {label}
    </span>
  );
}

function Metric({
  label,
  value,
  note,
  accent,
}: {
  label: string;
  value: string;
  note?: string;
  accent?: string;
}) {
  return (
    <div className="metric">
      <span>{label}</span>
      <strong style={{ color: accent }}>{value}</strong>
      {note && <small>{note}</small>}
    </div>
  );
}

function GapInventory({
  certificate,
  dual = false,
}: {
  certificate: Certificate;
  dual?: boolean;
}) {
  const groups = dual ? certificate.dual.groups : certificate.groups;
  return (
    <div className="gap-inventory">
      {groups.map((group) => (
        <div className="gap-row" key={group.type}>
          <span className="gap-token" style={{ background: group.color }}>
            {group.type}
          </span>
          <div className="gap-track">
            <span
              style={{
                width: Math.max(8, group.share * 100) + "%",
                background: group.color,
              }}
            />
          </div>
          <strong>{formatNumber(group.length, 5)}</strong>
          <small>{group.count} ×</small>
        </div>
      ))}
    </div>
  );
}

function CircleOrbit({
  certificate,
  step,
  setStep,
}: {
  certificate: Certificate;
  step: number;
  setStep: (step: number) => void;
}) {
  const es = useShellLang() === "es";
  const [playing, setPlaying] = useState(false);
  const controller = usePausedViz(
    (_dt, elapsed) => {
      const next = Math.min(
        certificate.points.length,
        1 + Math.floor(elapsed / 90),
      );
      setStep(next);
      if (next >= certificate.points.length) {
        setPlaying(false);
        return false;
      }
      return true;
    },
    {
      durationMs: Math.max(500, certificate.points.length * 90),
      autoStart: false,
      onComplete: () => setPlaying(false),
    },
  );
  const visible = certificate.points.slice(
    0,
    Math.max(1, Math.min(step, certificate.points.length)),
  );
  const sorted = [...visible].sort((a, b) => a.value - b.value);
  const circleGaps = sorted.map((point, index) => {
    const next = sorted[(index + 1) % sorted.length];
    return {
      start: point.value,
      end: next.value,
      length:
        index === sorted.length - 1
          ? 1 - point.value + next.value
          : next.value - point.value,
    };
  });
  const pointsToDraw = sorted.map((point) => ({
    point,
    xy: polar(point.value, 183, 260),
  }));
  const play = () => {
    if (step >= certificate.points.length) setStep(1);
    controller.toggle();
    setPlaying(!playing);
  };
  return (
    <div className="orbit-stage">
      <svg
        viewBox="0 0 520 520"
        role="img"
        aria-label={
          es
            ? "Órbita animada en el círculo unitario"
            : "Animated orbit on the unit circle"
        }
      >
        <defs>
          <radialGradient id="orbitGlow">
            <stop offset="0" stopColor="var(--gap-b)" stopOpacity=".18" />
            <stop offset="1" stopColor="var(--gap-b)" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="260" cy="260" r="224" fill="url(#orbitGlow)" />
        <circle cx="260" cy="260" r="184" className="orbit-ring" />
        {circleGaps.map((gap, index) => {
          const [x1, y1] = polar(gap.start, 184, 260);
          const [x2, y2] = polar(gap.end, 184, 260);
          const mid = frac(gap.start + gap.length / 2);
          const [lx, ly] = polar(mid, 202, 260);
          const gapColor =
            certificate.groups.find(
              (group) => Math.abs(group.length - gap.length) < 1e-8,
            )?.color ?? "var(--color-fg-subtle)";
          const path =
            "M " +
            x1 +
            " " +
            y1 +
            " A 184 184 0 " +
            (gap.length > 0.5 ? 1 : 0) +
            " 1 " +
            x2 +
            " " +
            y2;
          return (
            <g key={index}>
              <path d={path} className="gap-arc" style={{ stroke: gapColor }} />
              <text x={lx} y={ly} className="arc-label">
                {formatNumber(gap.length, 3)}
              </text>
            </g>
          );
        })}
        {pointsToDraw.map(({ point, xy }) => (
          <g key={point.id}>
            <circle
              cx={xy[0]}
              cy={xy[1]}
              r={point.index === step - 1 ? 8 : 4.5}
              className={
                point.index === step - 1
                  ? "orbit-point selected"
                  : "orbit-point"
              }
            />
            <text x={xy[0]} y={xy[1] - 12} className="point-index">
              {point.index}
            </text>
          </g>
        ))}
        <circle cx="260" cy="260" r="5" className="center-dot" />
        <text x="260" y="250" textAnchor="middle" className="center-label">
          R / Z
        </text>
        <text x="260" y="275" textAnchor="middle" className="center-sub">
          {es ? "órbita de rotación" : "rotation orbit"}
        </text>
      </svg>
      <div className="orbit-controls">
        <button
          className="icon-button primary"
          onClick={play}
          aria-label={
            playing
              ? es
                ? "Pausar órbita"
                : "Pause orbit"
              : es
                ? "Reproducir órbita"
                : "Play orbit"
          }
        >
          {playing ? <Pause size={16} /> : <Play size={16} />}
        </button>
        <button
          className="icon-button"
          onClick={() => {
            controller.pause();
            setPlaying(false);
            setStep(1);
          }}
          aria-label={es ? "Reiniciar órbita" : "Reset orbit"}
        >
          <RefreshCcw size={16} />
        </button>
        <input
          aria-label={es ? "Paso de órbita" : "Orbit step"}
          type="range"
          min={1}
          max={certificate.points.length}
          value={step}
          onChange={(event) => {
            controller.pause();
            setPlaying(false);
            setStep(Number(event.target.value));
          }}
        />
        <span className="mono">
          {String(step).padStart(2, "0")} / {certificate.points.length}
        </span>
      </div>
    </div>
  );
}

function Explore({
  certificate,
  scenario,
  setScenario,
  selectedId,
  onSelectPreset,
}: {
  certificate: Certificate;
  scenario: Scenario;
  setScenario: (next: Scenario) => void;
  selectedId: string;
  onSelectPreset: (id: string) => void;
}) {
  const [step, setStep] = useState(scenario.pointCount);
  const lang = useShellLang();
  const es = lang === "es";
  const update = (patch: Partial<Scenario>) => {
    setScenario({ ...scenario, ...patch });
    setStep(
      Math.min(scenario.pointCount, patch.pointCount ?? scenario.pointCount),
    );
  };
  return (
    <div className="workbench-grid">
      <aside className="control-column">
        <div className="panel control-panel">
          <div className="panel-kicker">
            <SlidersHorizontal size={15} />{" "}
            {es ? "PARÁMETROS VIVOS" : "LIVE PARAMETERS"}
          </div>
          <div className="control-heading">
            <h2>{es ? "Inicializa la órbita" : "Seed the orbit"}</h2>
            <p>
              {es
                ? "Cada control actualiza el mismo certificado, círculo, palabra y topología."
                : "Every control updates the same certificate, circle, word, and topology views."}
            </p>
          </div>
          <CaseSelector
            cases={presets.map((item) => ({
              id: item.id,
              name: es ? item.nameEs : item.name,
              category: es
                ? (CATEGORY_ES[item.category] ?? item.category)
                : item.category,
              anchor: item.anchor + " | " + item.expression,
            }))}
            selectedId={selectedId}
            onSelect={onSelectPreset}
            lang={lang}
            deepLink
            layout="select"
            ariaLabel={es ? "Escenario canónico" : "Canonical scenario"}
          />
          <label className="select-field">
            <span>{es ? "Proceso" : "Process"}</span>
            <select
              value={scenario.allocator}
              onChange={(event) =>
                update({
                  allocator: event.target.value as Scenario["allocator"],
                })
              }
            >
              <option value="rotation">
                {es ? "Rotación aritmética" : "Arithmetic rotation"}
              </option>
              <option value="random">
                {es ? "Aleatorio con semilla" : "Seeded random"}
              </option>
              <option value="farthest">
                {es
                  ? "Asignador de punto más lejano"
                  : "Farthest-point allocator"}
              </option>
            </select>
          </label>
          <Segmented
            value={scenario.alphaMode}
            onChange={(value) =>
              update({ alphaMode: value as Scenario["alphaMode"] })
            }
            options={[
              { value: "irrational", label: es ? "Irracional" : "Irrational" },
              { value: "numeric", label: es ? "Numérico" : "Numeric" },
              { value: "rational", label: "p / q" },
            ]}
          />
          {scenario.alphaMode === "rational" ? (
            <div className="fraction-inputs">
              <label>
                <span>p</span>
                <input
                  type="number"
                  value={scenario.rationalP}
                  onChange={(event) =>
                    update({ rationalP: Number(event.target.value) })
                  }
                />
              </label>
              <span>/</span>
              <label>
                <span>q</span>
                <input
                  type="number"
                  value={scenario.rationalQ}
                  onChange={(event) =>
                    update({ rationalQ: Number(event.target.value) })
                  }
                />
              </label>
            </div>
          ) : (
            <Field
              label={es ? "Paso angular alfa" : "Angle step alpha"}
              value={scenario.alpha}
              onChange={(value) => update({ alpha: value })}
              min={0.05}
              max={0.95}
              step={0.0005}
              suffix={es ? " vueltas" : " turns"}
            />
          )}
          <Field
            label={es ? "Puntos N" : "Points N"}
            value={scenario.pointCount}
            onChange={(value) => update({ pointCount: value })}
            min={3}
            max={120}
            step={1}
          />
          <Field
            label={es ? "Desfase" : "Phase offset"}
            value={scenario.phase}
            onChange={(value) => update({ phase: value })}
            min={0}
            max={0.99}
            step={0.005}
            suffix={es ? " vueltas" : " turns"}
          />
          <Field
            label={es ? "Objetivo beta" : "Target beta"}
            value={scenario.beta}
            onChange={(value) => update({ beta: value })}
            min={0.05}
            max={0.9}
            step={0.005}
          />
          {scenario.allocator === "random" && (
            <Field
              label={es ? "Semilla determinista" : "Deterministic seed"}
              value={scenario.seed}
              onChange={(value) => update({ seed: value })}
              min={1}
              max={999}
              step={1}
            />
          )}
          {scenario.allocator === "farthest" && (
            <Callout
              variant="honest"
              title={es ? "Proceso de contraste" : "Contrast process"}
            >
              <span>
                {es
                  ? "Los puntos medios del mayor arco vacío se asignan de forma voraz. Este proceso está fuera de la rotación aritmética."
                  : "Midpoints of the largest empty arc are allocated greedily. This is intentionally outside arithmetic rotation."}
              </span>
            </Callout>
          )}
          <div className="control-actions">
            <button
              className="button primary"
              onClick={() => onSelectPreset(presets[0].id)}
            >
              <RefreshCcw size={15} />{" "}
              {es ? "Restaurar base" : "Restore baseline"}
            </button>
            <button
              className="button ghost"
              onClick={() =>
                setScenario({
                  ...scenario,
                  phase: frac(scenario.phase + scenario.alpha),
                })
              }
            >
              {es ? "Avanzar fase" : "Advance phase"}{" "}
              <ArrowDownRight size={15} />
            </button>
          </div>
        </div>
        <div className="panel certificate-panel">
          <div className="panel-kicker">
            <Gauge size={15} /> {es ? "CERTIFICADO" : "CERTIFICATE"}
          </div>
          <div className="certificate-top">
            <StatusBadge certificate={certificate} />
            <span className="mono">N = {certificate.points.length}</span>
          </div>
          <p>
            {es
              ? {
                  certified:
                    "El certificado concuerda: como máximo tres brechas y relación aditiva cuando aparecen tres.",
                  boundary:
                    "Caso de frontera: entrada racional o con colisiones. No se afirma el teorema irracional.",
                  contrast:
                    "Proceso de contraste: el asignador no es una rotación aritmética.",
                  warning:
                    "Advertencia diagnóstica: las verificaciones requieren atención.",
                }[certificate.theoremStatus]
              : certificate.theoremMessage}
          </p>
          <div className="metric-grid">
            <Metric
              label={es ? "Brechas distintas" : "Distinct gaps"}
              value={String(certificate.distinctCount)}
              note={es ? "límite ≤ 3" : "bound ≤ 3"}
              accent="var(--gap-b)"
            />
            <Metric
              label={es ? "Residuo mayor" : "Largest residual"}
              value={formatNumber(certificate.sumCheck.residual, 7)}
              note="c − a − b"
              accent="var(--gap-a)"
            />
          </div>
          <div className="equation-line">
            <InlineMath
              tex={
                certificate.distinctCount === 3 ? "c = a + b" : "D_N \\leq 3"
              }
            />
          </div>
        </div>
      </aside>
      <section className="main-visual">
        <div className="panel visual-panel">
          <div className="visual-header">
            <div>
              <div className="panel-kicker">
                <CircleDot size={15} />{" "}
                {es ? "ÓRBITA PRINCIPAL" : "PRIMARY ORBIT"}
              </div>
              <h2>
                {es
                  ? "Una rotación, muchas lecturas"
                  : "One rotation, many readings"}
              </h2>
            </div>
            <div className="alpha-readout">
              <span>α</span>
              <strong>{formatNumber(certificate.scenario.alpha, 6)}</strong>
              <small>
                {formatNumber(certificate.scenario.alpha * 360, 2)}°
              </small>
            </div>
          </div>
          <CircleOrbit
            certificate={certificate}
            step={step}
            setStep={setStep}
          />
          <div className="visual-footer">
            <div className="legend">
              <span>
                <i style={{ background: "var(--gap-a)" }} />a
              </span>
              <span>
                <i style={{ background: "var(--gap-b)" }} />b
              </span>
              <span>
                <i style={{ background: "var(--gap-c)" }} />c = a + b
              </span>
            </div>
            <span className="quiet">
              {es
                ? "Arrastra el paso o reproduce la secuencia de divisiones"
                : "Drag the step handle or play the split sequence"}
            </span>
          </div>
        </div>
        <div className="lower-grid">
          <div className="panel">
            <div className="panel-title">
              <span>{es ? "Inventario de brechas" : "Gap inventory"}</span>
              <span className="quiet">
                {es ? "ordenado por longitud" : "sorted by length"}
              </span>
            </div>
            <GapInventory certificate={certificate} />
          </div>
          <div className="panel lineage-card">
            <div className="panel-title">
              <span>{es ? "Genealogía de brechas" : "Gap genealogy"}</span>
              <GitBranch size={16} />
            </div>
            <div className="lineage-flow">
              {certificate.lineage.slice(1, 8).map((item) => (
                <div className="lineage-step" key={item.index}>
                  <b>{item.index}</b>
                  <span className="lineage-parent">
                    {formatNumber(item.parentLength, 3)}
                  </span>
                  <ArrowDownRight size={12} />
                  <span className="lineage-child">
                    {item.childLengths
                      ? formatNumber(item.childLengths[0], 3) +
                        " + " +
                        formatNumber(item.childLengths[1], 3)
                      : es
                        ? "colisión"
                        : "collision"}
                  </span>
                </div>
              ))}
            </div>
            <small className="quiet">
              {es
                ? "Cada punto aritmético nuevo divide un arco vacío existente."
                : "Each new arithmetic point splits one existing empty arc."}
            </small>
          </div>
        </div>
      </section>
    </div>
  );
}

function ProofAtlas({
  certificate,
  scenario,
}: {
  certificate: Certificate;
  scenario: Scenario;
}) {
  const es = useShellLang() === "es";
  const cells = Array.from({ length: 14 }, (_, index) => ({
    x: 0.08 + index * 0.062,
    width: 0.055 + (index % 3) * 0.012,
    shade: index % 2,
  }));
  const cursor = 52 + scenario.alpha * 540;
  return (
    <div className="deep-grid">
      <section className="panel atlas-panel">
        <div className="panel-kicker">
          <Aperture size={15} />{" "}
          {es ? "ESPACIO DE PARÁMETROS DE HAMADA" : "HAMADA'S PARAMETER SPACE"}
        </div>
        <div className="deep-header">
          <div>
            <h2>
              {es
                ? "El teorema como celda móvil"
                : "The theorem as a moving cell"}
            </h2>
            <p>
              At fixed N, the alpha-height diagram changes combinatorial type
              only at Farey events. The live cursor is not decoration: it reads
              the exact candidate lengths below.
            </p>
          </div>
          <StatusBadge certificate={certificate} />
        </div>
        <svg
          className="atlas-svg"
          viewBox="0 0 640 290"
          role="img"
          aria-label="Farey parameter atlas"
        >
          <defs>
            <linearGradient id="atlas-bg" x1="0" x2="1">
              <stop stopColor="var(--color-surface)" />
              <stop offset="1" stopColor="var(--color-surface-2)" />
            </linearGradient>
          </defs>
          <rect
            x="0"
            y="0"
            width="640"
            height="290"
            rx="16"
            fill="url(#atlas-bg)"
          />
          {cells.map((cell, i) => (
            <g key={i}>
              <rect
                x={cell.x * 640}
                y={34 + (i % 2) * 18}
                width={cell.width * 640}
                height={215 - (i % 4) * 22}
                fill={cell.shade ? "var(--gap-b)" : "var(--gap-a)"}
                opacity=".08"
              />
              <line
                x1={cell.x * 640}
                y1="28"
                x2={cell.x * 640 + cell.width * 640}
                y2="248"
                stroke={cell.shade ? "var(--gap-b)" : "var(--gap-a)"}
                opacity=".22"
                strokeDasharray="3 5"
              />
            </g>
          ))}
          {[0, 1, 2].map((i) => (
            <path
              key={i}
              d={
                "M 20 " +
                (236 - i * 58) +
                " C 180 " +
                (220 - i * 34) +
                ", 340 " +
                (170 - i * 20) +
                ", 620 " +
                (45 + i * 42)
              }
              stroke={["var(--gap-a)", "var(--gap-b)", "var(--gap-c)"][i]}
              strokeWidth="2"
              fill="none"
              opacity=".85"
            />
          ))}
          <line
            x1={cursor}
            x2={cursor}
            y1="18"
            y2="257"
            stroke="var(--color-fg)"
            strokeWidth="2"
          />
          <circle cx={cursor} cy="18" r="6" fill="var(--color-fg)" />
          <text x="22" y="276" fill="var(--color-fg-subtle)" fontSize="11">
            0
          </text>
          <text x="600" y="276" fill="var(--color-fg-subtle)" fontSize="11">
            1
          </text>
          <text x={cursor + 9} y="30" fill="var(--color-fg)" fontSize="11">
            α = {formatNumber(scenario.alpha, 4)}
          </text>
        </svg>
        <div className="atlas-axis">
          <span>
            {es ? "Celdas de Farey de orden N" : "Farey cells of order N"}
          </span>
          <span>
            {es
              ? "altura h = parte fraccionaria"
              : "height h = fractional part"}
          </span>
        </div>
      </section>
      <aside className="stack">
        <div className="panel">
          <div className="panel-title">
            <span>
              {es ? "Intervalo de Farey activo" : "Active Farey bracket"}
            </span>
            <span className="mono">
              {certificate.farey.left[0]}/{certificate.farey.left[1]} &lt; α
              &lt; {certificate.farey.right[0]}/{certificate.farey.right[1]}
            </span>
          </div>
          <div className="formula-list">
            {certificate.farey.candidates.map((item) => (
              <div className="formula-row" key={item.label}>
                <span className="gap-token" style={{ background: item.color }}>
                  {item.label}
                </span>
                <div>
                  <strong>{formatNumber(item.length, 6)}</strong>
                  <small>
                    {es ? "longitud candidata" : "candidate length"}
                  </small>
                </div>
                <b>{item.count}</b>
                <small>{es ? "multiplicidad" : "multiplicity"}</small>
              </div>
            ))}
          </div>
          <Callout
            variant="strong"
            title={es ? "Relación exacta" : "Exact relation"}
          >
            <span>
              The third candidate is the sum of the first two whenever the
              three-candidate cell is active.
            </span>
          </Callout>
        </div>
        <div className="panel">
          <div className="panel-title">
            <span>{es ? "Fracción continua" : "Continued fraction"}</span>
            <span className="mono">{es ? "convergentes" : "convergents"}</span>
          </div>
          <div className="continued-row">
            {certificate.continuedFraction.convergents
              .slice(1, 6)
              .map((item) => (
                <span key={item.q}>
                  <b>
                    {item.p}/{item.q}
                  </b>
                  <small>{item.error.toExponential(1)}</small>
                </span>
              ))}
          </div>
          <Refs
            ids={["hamada2024", "alessandri1998"]}
            label={es ? "Fuentes" : "Sources"}
          />
        </div>
      </aside>
    </div>
  );
}

function ReturnGaps({
  certificate,
  scenario,
}: {
  certificate: Certificate;
  scenario: Scenario;
}) {
  const es = useShellLang() === "es";
  const selected = certificate.dual.selected.slice(0, 22);
  return (
    <div className="deep-grid">
      <section className="panel return-hero">
        <div className="panel-kicker">
          <Target size={15} />{" "}
          {es ? "TIEMPOS DE RETORNO DUALES" : "DUAL RETURN TIMES"}
        </div>
        <div className="deep-header">
          <div>
            <h2>{es ? "Visitas bajo beta" : "Visits below beta"}</h2>
            <p>
              Instead of looking at every adjacent point, select indices whose
              orbit lands in the target interval [0, β). Their index jumps form
              a second three-gap phenomenon.
            </p>
          </div>
          <span className="regime-badge">{certificate.dual.regime}</span>
        </div>
        <div className="return-track">
          <div
            className="target-band"
            style={{ width: certificate.scenario.beta * 100 + "%" }}
          >
            <span>target [0, β)</span>
          </div>
          {selected.map((index, i) => (
            <span
              key={index}
              className="visit-mark"
              style={{
                left: frac(index * scenario.alpha + scenario.phase) * 100 + "%",
              }}
              title={"visit index " + index}
            >
              <i />
              {i < 8 && <small>{index}</small>}
            </span>
          ))}
        </div>
        <div className="return-sequence">
          {selected.slice(0, 12).map((index, i) => (
            <div key={index} className="return-node">
              <span>{index}</span>
              {i < 11 && <ArrowDownRight size={14} />}
            </div>
          ))}
        </div>
      </section>
      <aside className="stack">
        <div className="panel">
          <div className="panel-title">
            <span>
              {es ? "Inventario de retornos" : "Return-gap inventory"}
            </span>
            <span className="quiet">
              {es ? "diferencias de índices" : "index differences"}
            </span>
          </div>
          <GapInventory certificate={certificate} dual />
        </div>
        <div className="panel">
          <div className="panel-kicker">
            <Info size={15} /> {es ? "CONVENCIÓN" : "CONVENTION"}
          </div>
          <p className="small-copy">
            The strict boundary excludes a visit exactly at beta. Toggle this
            convention in the experiment source to see endpoint sensitivity.
            This panel is a dual theorem view, not another claim about the
            primal circle gaps.
          </p>
          <Refs
            ids={["hamada2024", "alessandri1998"]}
            label={es ? "Fuentes" : "Sources"}
          />
        </div>
      </aside>
    </div>
  );
}

function Topology({
  certificate,
  threshold,
  setThreshold,
}: {
  certificate: Certificate;
  threshold: number;
  setThreshold: (value: number) => void;
}) {
  const es = useShellLang() === "es";
  const events = certificate.topology.events;
  return (
    <div className="deep-grid">
      <section className="panel topology-panel">
        <div className="panel-kicker">
          <Layers3 size={15} />{" "}
          {es
            ? "LENTE DE RIPS EN DIMENSIÓN CERO"
            : "ZERO-DIMENSIONAL RIPS LENS"}
        </div>
        <div className="deep-header">
          <div>
            <h2>
              {es
                ? "La conectividad aparece en longitudes de brecha"
                : "Connectivity appears at gap lengths"}
            </h2>
            <p>
              Raise a threshold on the sampled circle. Every merge is tied to an
              actual nearest-neighbor gap, so the topology view stays traceable
              to the orbit.
            </p>
          </div>
          <Metric
            label={es ? "componentes" : "components"}
            value={String(certificate.topology.components)}
            note={(es ? "umbral " : "threshold ") + formatNumber(threshold, 4)}
            accent="var(--gap-b)"
          />
        </div>
        <div className="topology-slider">
          <Field
            label={es ? "Umbral de filtración" : "Filtration threshold"}
            value={threshold}
            onChange={setThreshold}
            min={0.001}
            max={Math.max(
              0.06,
              Math.max(...certificate.gaps.map((gap) => gap.length)),
            )}
            step={0.001}
          />
        </div>
        <div className="merge-tree">
          {certificate.topology.bars.slice(0, 20).map((bar, index) => (
            <div className="bar-row" key={bar.id}>
              <span>{index + 1}</span>
              <div className="bar-track">
                <i
                  style={{
                    width: Math.min(100, bar.death * 100) + "%",
                    background:
                      certificate.groups[index % certificate.groups.length]
                        ?.color,
                  }}
                />
              </div>
              <small>{formatNumber(bar.death, 4)}</small>
            </div>
          ))}
        </div>
        <div className="topology-events">
          {events.map((event) => (
            <button
              key={event.threshold}
              className={
                Math.abs(event.threshold - threshold) < 0.004 ? "active" : ""
              }
              onClick={() => setThreshold(event.threshold)}
            >
              <b>{formatNumber(event.threshold, 4)}</b>
              <span>
                {event.components} {es ? "componentes" : "components"}
              </span>
            </button>
          ))}
        </div>
      </section>
      <aside className="stack">
        <div className="panel">
          <div className="panel-title">
            <span>
              {es ? "Lectura del código de barras" : "Reading the barcode"}
            </span>
            <Activity size={16} />
          </div>
          <div className="barcode">
            {certificate.topology.bars.slice(0, 14).map((bar, index) => (
              <div
                key={bar.id}
                style={{
                  left: "3%",
                  width: Math.max(5, bar.death * 94) + "%",
                  top: index * 18 + "px",
                  background:
                    certificate.groups[index % certificate.groups.length]
                      ?.color,
                }}
              />
            ))}
          </div>
          <p className="small-copy">
            Each horizontal bar starts at 0 and dies at a circular gap length.
            This is the finite 0D interpretation described by{" "}
            <Cite id="suarez2026" paren />.
          </p>
        </div>
        <Callout
          variant="honest"
          title={es ? "Topología acotada" : "Scoped topology"}
        >
          <span>
            This is a transparent finite 0D Rips certificate. It is not a
            general-purpose persistent-homology engine.
          </span>
        </Callout>
      </aside>
    </div>
  );
}

function WordView({ certificate }: { certificate: Certificate }) {
  const es = useShellLang() === "es";
  const word = certificate.word.word;
  return (
    <div className="extension-card full">
      <div className="panel-kicker">
        <Waypoints size={15} />{" "}
        {es ? "COMBINATORIA DE PALABRAS" : "COMBINATORICS ON WORDS"}
      </div>
      <h3>
        {es
          ? "El círculo como oración cíclica"
          : "The circle as a cyclic sentence"}
      </h3>
      <p>
        Gap types become a word around the circle. The largest-gap anchor gives
        a local symmetry probe, inspired by the matching structure studied by
        Dasgupta and Roeder.
      </p>
      <div className="word-ribbon">
        {word.split("").map((letter, index) => (
          <span
            key={index}
            style={{ background: certificate.word.palette[letter] }}
          >
            {letter}
          </span>
        ))}
      </div>
      <div className="word-meta">
        <Metric
          label={es ? "largo de palabra" : "word length"}
          value={String(word.length)}
        />
        <Metric
          label={es ? "alfabeto" : "alphabet"}
          value={String(certificate.groups.length)}
        />
        <Metric
          label={es ? "coincidencias en el ancla" : "matched around anchor"}
          value={
            certificate.word.symmetry.matched +
            " / " +
            certificate.word.symmetry.total
          }
        />
      </div>
      <Refs
        ids={["dasgupta2023", "alessandri1998"]}
        label={es ? "Fuentes" : "Sources"}
      />
    </div>
  );
}

function LatticeView({
  certificate,
  scenario,
}: {
  certificate: Certificate;
  scenario: Scenario;
}) {
  const es = useShellLang() === "es";
  return (
    <div className="extension-card">
      <div className="panel-kicker">
        <Grid3X3 size={15} />{" "}
        {es ? "ESPACIO DE RETÍCULOS" : "SPACE OF LATTICES"}
      </div>
      <h3>
        {es
          ? "Una órbita, una ventana de retículo"
          : "One orbit, one lattice window"}
      </h3>
      <p>
        Rotation data can be lifted to a unimodular lattice. Active short
        vectors are highlighted; the direct circle certificate remains the
        reference.
      </p>
      <svg viewBox="0 0 360 260" className="lattice-svg">
        {Array.from({ length: 9 }, (_, i) => (
          <line
            key={"v-" + i}
            x1={20 + i * 40}
            y1="16"
            x2={20 + i * 40}
            y2="244"
            stroke="currentColor"
            opacity=".12"
          />
        ))}
        {Array.from({ length: 6 }, (_, i) => (
          <line
            key={"h-" + i}
            x1="20"
            y1={24 + i * 40}
            x2="340"
            y2={24 + i * 40}
            stroke="currentColor"
            opacity=".12"
          />
        ))}
        {certificate.lattice.map((vector, index) => (
          <circle
            key={index}
            cx={180 + vector.x * 22}
            cy={130 - vector.y * 22}
            r={vector.active ? 5 : 2.3}
            className={vector.active ? "lattice-active" : "lattice-dot"}
          />
        ))}
        <circle cx="180" cy="130" r="4" className="center-dot" />
      </svg>
      <div className="lattice-readout">
        <span>
          {es
            ? "capa activa de vectores cortos"
            : "active shortest-vector shell"}
        </span>
        <b>α = {formatNumber(scenario.alpha, 5)}</b>
      </div>
      <Refs ids={["marklof2017"]} label={es ? "Fuente" : "Source"} />
    </div>
  );
}

function Extensions({
  certificate,
  scenario,
}: {
  certificate: Certificate;
  scenario: Scenario;
}) {
  const es = useShellLang() === "es";
  const history = useMemo(
    () => gapCountHistory(scenario, Math.min(80, scenario.pointCount)),
    [scenario],
  );
  const discrepancy = starDiscrepancy(certificate.points);
  const tabs = [
    {
      id: "word",
      label: es ? "Palabra" : "Gap word",
      content: <WordView certificate={certificate} />,
    },
    {
      id: "lattice",
      label: es ? "Retículo" : "Lattice",
      content: <LatticeView certificate={certificate} scenario={scenario} />,
    },
    {
      id: "exchange",
      label: "2-IET",
      content: (
        <div className="extension-card full">
          <div className="panel-kicker">
            <GitBranch size={15} /> {es ? "INTERCAMBIO DE INTERVALOS" : "INTERVAL EXCHANGE"}
          </div>
          <h3>{es ? "La rotación es un intercambio de dos intervalos" : "Rotation is a two-interval exchange"}</h3>
          <div className="exchange-diagram">
            <div className="exchange-line">
              <span style={{ width: (1 - scenario.alpha) * 100 + "%" }}>I₁</span>
              <span style={{ width: scenario.alpha * 100 + "%" }}>I₂</span>
            </div>
            <ArrowDownRight size={26} />
            <div className="exchange-line reversed">
              <span style={{ width: scenario.alpha * 100 + "%" }}>I₂</span>
              <span style={{ width: (1 - scenario.alpha) * 100 + "%" }}>I₁</span>
            </div>
          </div>
          <p>{es
            ? "Cortar el círculo en el origen de la órbita convierte la rotación en un intercambio de dos intervalos. Esta lectura conserva el mismo estado; no extiende el certificado a intercambios arbitrarios."
            : "Cutting the circle at the orbit origin turns the rotation into a two-interval exchange. This reading preserves the same state; it does not extend the certificate to arbitrary exchanges."}</p>
          <Refs ids={["taha2018", "alessandri1998"]} label={es ? "Fuentes" : "Sources"} />
        </div>
      ),
    },
    {
      id: "discrepancy",
      label: es ? "Discrepancia" : "Discrepancy",
      content: (
        <div className="extension-card full">
          <div className="panel-kicker">
            <Gauge size={15} /> {es ? "DISTRIBUCIÓN EMPÍRICA" : "EMPIRICAL DISTRIBUTION"}
          </div>
          <h3>{es ? "Discrepancia estrella de la órbita" : "Star discrepancy of the orbit"}</h3>
          <p>{es
            ? "La escalera empírica se compara con la distribución uniforme. Cada barra es una desviación recalculada para el estado finito seleccionado."
            : "The empirical staircase is compared with the uniform distribution. Every bar is a deviation recomputed for the selected finite state."}</p>
          <div className="discrepancy-chart" aria-label={es ? "Perfil de discrepancia" : "Discrepancy profile"}>
            {certificate.sortedPoints.map((point, index) => (
              <i
                key={point.id}
                style={{
                  left: `${point.value * 100}%`,
                  height: `${Math.min(100, Math.max(4, Math.abs((index + 1) / certificate.points.length - point.value) * 700))}%`,
                }}
              />
            ))}
            <span className="uniform-diagonal" />
          </div>
          <div className="word-meta">
            <Metric label="D*N" value={formatNumber(discrepancy, 6)} />
            <Metric label={es ? "puntos" : "points"} value={String(certificate.points.length)} />
            <Metric label={es ? "proceso" : "process"} value={scenario.allocator} />
          </div>
          <Callout variant="honest" title={es ? "Lectura finita" : "Finite reading"}>
            <span>{es
              ? "La discrepancia cuantifica uniformidad en esta muestra; no certifica irracionalidad ni convergencia asintótica."
              : "Discrepancy quantifies uniformity in this sample; it does not certify irrationality or asymptotic convergence."}</span>
          </Callout>
          <Refs ids={["haynes2014", "marklof2017"]} label={es ? "Fuentes" : "Sources"} />
        </div>
      ),
    },
    {
      id: "events",
      label: es ? "Eventos N" : "N events",
      content: (
        <div className="extension-card full">
          <div className="panel-kicker">
            <Activity size={15} /> {es ? "BARRIDO DE TAMAÑO FINITO" : "FINITE-SIZE SWEEP"}
          </div>
          <h3>{es ? "Cuándo cambia el alfabeto de brechas" : "When the gap alphabet changes"}</h3>
          <p>{es
            ? "Cada columna recalcula la partición directa para un valor de N. Los cambios de color exponen eventos discretos organizados por denominadores convergentes."
            : "Each column recomputes the direct partition for one N value. Color changes expose discrete events organized by convergent denominators."}</p>
          <div className="event-sweep">
            {history.map((item) => (
              <span
                key={item.n}
                className={`gap-count-${Math.min(3, item.count)}`}
                title={`N=${item.n}, D=${item.count}`}
                style={{ height: `${28 + item.count * 18}px` }}
              />
            ))}
          </div>
          <div className="event-axis"><span>N = 3</span><span>N = {history.at(-1)?.n}</span></div>
          <div className="word-meta">
            <Metric label={es ? "eventos" : "events"} value={String(history.filter((item, index) => index > 0 && item.count !== history[index - 1].count).length)} />
            <Metric label="max D" value={String(Math.max(...history.map((item) => item.count)))} />
            <Metric label={es ? "muestras" : "samples"} value={String(history.length)} />
          </div>
          <Refs ids={["hamada2024", "berthe2024"]} label={es ? "Fuentes" : "Sources"} />
        </div>
      ),
    },
    {
      id: "contrast",
      label: es ? "Contrastes" : "Contrasts",
      content: (
        <div className="extension-card full">
          <div className="panel-kicker">
            <Dna size={15} /> {es ? "CONTRASTES CONTROLADOS" : "CONTROLLED CONTRASTS"}
          </div>
          <h3>{es ? "Cambiar el proceso cambia la pregunta" : "Changing the process changes the question"}</h3>
          <p>{es
            ? "La rotación es aritmética; la inserción más lejana optimiza espacio vacío y el muestreo de dos frecuencias estudia otro sistema. Son controles de hipótesis, no contraejemplos fabricados."
            : "Rotation is arithmetic; farthest-point insertion optimizes empty space, and two-frequency sampling studies another system. These are hypothesis controls, not manufactured counterexamples."}</p>
          <div className="contrast-grid">
            {[
              { label: es ? "rotación" : "rotation", value: certificate.distinctCount, tone: "b" },
              { label: es ? "dos frecuencias" : "two-frequency", value: certificate.extension.distinctCount, tone: "c" },
              { label: es ? "punto más lejano" : "farthest point", value: computeCertificate({ ...scenario, allocator: "farthest" }).distinctCount, tone: "a" },
            ].map((item) => (
              <div key={item.label} className={`contrast-stat tone-${item.tone}`}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
                <small>{es ? "brechas distintas" : "distinct gaps"}</small>
              </div>
            ))}
          </div>
          <Callout variant="honest" title={es ? "Frontera preservada" : "Boundary preserved"}>
            <span>{es
              ? "Los resultados de mayor dimensión y de otros asignadores son comparaciones. El distintivo clásico se aplica solo al régimen de rotación declarado."
              : "Higher-dimensional and allocator results are comparisons. The classical badge applies only to the declared rotation regime."}</span>
          </Callout>
          <Refs ids={["alessandri1998", "marklof2017"]} label={es ? "Fuentes" : "Sources"} />
        </div>
      ),
    },
  ];
  return (
    <div className="extension-layout">
      <SubTabs
        tabs={tabs}
        ariaLabel={es ? "Lecturas extendidas" : "Extended readings"}
      />
    </div>
  );
}

function App() {
  const [scenario, setScenario] = useState<Scenario>(initialScenario);
  const [selectedId, setSelectedId] = useState(presets[0].id);
  const [threshold, setThreshold] = useState(0.03);
  const certificate = useMemo(
    () => computeCertificate(scenario, threshold),
    [scenario, threshold],
  );
  const lang = useShellLang();
  const shellConfig = {
    product: { name: "GapTheo", mark: <Sparkles size={18} /> },
    routes: [
      { path: "/", en: "Workbench", es: "Laboratorio" },
      { path: "/introduction", en: "Introduction", es: "Introducción" },
      { path: "/methodology", en: "Methodology", es: "Metodología" },
      { path: "/implementation", en: "Implementation", es: "Implementación" },
      { path: "/experiments", en: "Experiments", es: "Experimentos" },
      { path: "/benchmark", en: "Benchmark", es: "Benchmark" },
    ],
    links: {
      github: "https://github.com/fsantibanezleal/CAOS_RES_GapTheo",
      personal: "https://fasl-work.com",
      portfolio: "https://www.fasl-work.com",
    },
    version: __APP_VERSION__,
    fixedRoutes: ["/"],
    architecture,
    footer: {
      attribution: {
        en: "Developed by Felipe Santibáñez-Leal",
        es: "Desarrollado por Felipe Santibáñez-Leal",
      },
      license: {
        en: "Apache-2.0 research software",
        es: "Software de investigación Apache-2.0",
      },
      provenance: {
        en: "Engine: deterministic finite rotation certificates",
        es: "Motor: certificados deterministas de rotación finita",
      },
      disclaimer: {
        en: "Runs locally in your browser; no account or server is required.",
        es: "Se ejecuta localmente en tu navegador; no requiere cuenta ni servidor.",
      },
    },
  };
  const selectPreset = (id: string) => {
    const preset = presets.find((item) => item.id === id) ?? presets[0];
    setSelectedId(preset.id);
    setScenario(scenarioFromPreset(preset));
    setThreshold(0.03);
  };
  return (
    <CitationsProvider items={CITATIONS}>
      <AppShell config={shellConfig}>
        <RoutesView
          scenario={scenario}
          setScenario={setScenario}
          certificate={certificate}
          threshold={threshold}
          setThreshold={setThreshold}
          selectedId={selectedId}
          onSelectPreset={selectPreset}
        />
      </AppShell>
    </CitationsProvider>
  );
}

function RoutesView({
  scenario,
  setScenario,
  certificate,
  threshold,
  setThreshold,
  selectedId,
  onSelectPreset,
}: {
  scenario: Scenario;
  setScenario: (scenario: Scenario) => void;
  certificate: Certificate;
  threshold: number;
  setThreshold: (value: number) => void;
  selectedId: string;
  onSelectPreset: (id: string) => void;
}) {
  const location = useLocation();
  const lang = useShellLang();
  const es = lang === "es";
  if (location.pathname !== "/")
    return (
      <ResearchRoute
        path={
          location.pathname === "/references" ? "/benchmark" : location.pathname
        }
      />
    );
  const tabs = [
    {
      id: "explore",
      label: es ? "Explorar" : "Explore",
      content: (
        <Explore
          certificate={certificate}
          scenario={scenario}
          setScenario={setScenario}
          selectedId={selectedId}
          onSelectPreset={onSelectPreset}
        />
      ),
    },
    {
      id: "atlas",
      label: es ? "Atlas de prueba" : "Proof Atlas",
      content: <ProofAtlas certificate={certificate} scenario={scenario} />,
    },
    {
      id: "return",
      label: es ? "Retornos" : "Return Gaps",
      content: <ReturnGaps certificate={certificate} scenario={scenario} />,
    },
    {
      id: "topology",
      label: es ? "Topología" : "Topology",
      content: (
        <Topology
          certificate={certificate}
          threshold={threshold}
          setThreshold={setThreshold}
        />
      ),
    },
    {
      id: "extensions",
      label: es ? "Extensiones" : "Extensions",
      content: <Extensions certificate={certificate} scenario={scenario} />,
    },
  ];
  return (
    <main className="page-body wide app-main">
      <section className="workbench-statusbar">
        <div>
          <span className="eyebrow">
            {es ? "INSTRUMENTO DE INVESTIGACIÓN" : "RESEARCH INSTRUMENT"}
          </span>
          <strong>{es ? "Dinámica finita de tres brechas" : "Finite three-gap dynamics"}</strong>
        </div>
        <div className="workbench-live-status">
          <StatusBadge certificate={certificate} />
          <span className="mono">N={scenario.pointCount}</span>
          <span className="mono">D={certificate.distinctCount}</span>
          <span className="mono">ρΣ={certificate.sumCheck.residual.toExponential(1)}</span>
        </div>
      </section>
      <Tabs tabs={tabs} ariaLabel={es ? "Vistas de investigación" : "Research views"} />
    </main>
  );
}

export default App;
