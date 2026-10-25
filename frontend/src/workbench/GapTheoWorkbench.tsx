import { useMemo, useState } from "react";
import {
  Callout,
  CaseSelector,
  InlineMath,
  Refs,
  SurfacePage,
  SubTabs,
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
} from "../core/gapEngine";
import scenarioData from "../data/scenarios.json";

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

function formatNumber(value: number, digits = 5, spanish = false): string {
  return Number.isFinite(value)
    ? new Intl.NumberFormat(spanish ? "es-ES" : "en-US", {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
        useGrouping: false,
      }).format(value)
    : "n/a";
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
  const es = useShellLang() === "es";
  return (
    <label className="field">
      <span>
        <span className="field-label">{label}</span>
        <b>
          {formatNumber(value, Number.isInteger(step) ? 0 : step < 0.01 ? 4 : 2, es)}
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
          className={value === option.value ? "segmented-choice is-selected" : "segmented-choice"}
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
          certified: "CONDICIONAL",
          boundary: "FRONTERA",
          contrast: "CONTRASTE",
          warning: "ADVERTENCIA",
        }
      : {
          certified: "CONDITIONAL",
          boundary: "BOUNDARY",
          contrast: "CONTRAST",
          warning: "WARNING",
        }
  )[certificate.theoremStatus];
  const shownLabel =
    certificate.theoremStatus === "boundary" &&
    certificate.scenario.alphaMode === "numeric"
      ? es
        ? "NO VERIFICADO"
        : "UNVERIFIED"
      : label;
  return (
    <span className={"status-badge " + certificate.theoremStatus}>
      <i />
      {shownLabel}
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
  const es = useShellLang() === "es";
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
          <strong>{formatNumber(group.length, 5, es)}</strong>
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
  const [speed, setSpeed] = useState(1);
  const controller = usePausedViz(
    (_dt, elapsed) => {
      const next = Math.min(
        certificate.points.length,
        1 + Math.floor((elapsed * speed) / 90),
      );
      setStep(next);
      if (next >= certificate.points.length) {
        setPlaying(false);
        return false;
      }
      return true;
    },
    {
      durationMs: Math.max(500, (certificate.points.length * 90) / speed),
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
    <div className={playing ? "orbit-stage is-playing" : "orbit-stage"}>
      <svg
        viewBox="40 40 440 440"
        role="img"
        aria-label={
          es
            ? "Órbita animada en el círculo unitario"
            : "Animated orbit on the unit circle"
        }
      >
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
          const showGapLabel = circleGaps.findIndex(
            (candidate) => Math.abs(candidate.length - gap.length) < 1e-8,
          ) === index;
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
              {showGapLabel && (
                <text x={lx} y={ly} className="arc-label">
                  {formatNumber(gap.length, 4, es)}
                </text>
              )}
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
            {(pointsToDraw.length <= 18 || point.index === step - 1) && (
              <text x={xy[0]} y={xy[1] - 12} className="point-index">
                {point.index}
              </text>
            )}
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
          className="btn primary icon-button"
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
          className="btn icon-button"
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
        <span className="mono orbit-readout">
          {String(step).padStart(2, "0")} / {certificate.points.length}
        </span>
        <label className="orbit-speed">
          <span>{es ? "Velocidad" : "Speed"}</span>
          <input
            aria-label={es ? "Velocidad de reproducción" : "Playback speed"}
            type="range"
            min="0.5"
            max="3"
            step="0.5"
            value={speed}
            onChange={(event) => setSpeed(Number(event.target.value))}
          />
          <b>{speed}×</b>
        </label>
      </div>
      {certificate.points.length > 18 && <small className="quiet orbit-density">{es
        ? `Se muestran ${certificate.points.length} puntos; las etiquetas se reducen para conservar la legibilidad.`
        : `${certificate.points.length} points are shown; labels are reduced to preserve legibility.`}</small>}
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
        <div className="card control-panel">
          <div className="panel-kicker">
            <SlidersHorizontal size={15} />{" "}
            {es ? "PARÁMETROS VIVOS" : "LIVE PARAMETERS"}
          </div>
          <div className="control-heading">
            <h2>{es ? "Parámetros de rotación" : "Rotation parameters"}</h2>
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
              <option value="anchors">{es ? "Anclas y bisección" : "Anchors and bisection"}</option>
            </select>
          </label>
          <Segmented
            value={scenario.alphaMode}
            onChange={(value) =>
              update({ alphaMode: value as Scenario["alphaMode"] })
            }
            options={[
              { value: "irrational", label: es ? "Asumir irracionalidad" : "Assume irrational" },
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
              onChange={(value) => update({ alpha: value, alphaMode: "numeric" })}
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
          {scenario.allocator === "anchors" && (
            <>
              <Field
                label={es ? "Cantidad de anclas" : "Number of anchors"}
                value={scenario.anchorCount}
                onChange={(anchorCount) => update({ anchorCount })}
                min={1}
                max={4}
                step={1}
              />
              <Callout variant="honest" title={es ? "Proceso de contraste" : "Contrast process"}>
                <span>{es
                  ? "Se colocan primero anclas uniformes desde la fase seleccionada; las posiciones restantes bisecan siempre el mayor arco vacío. No es una órbita de rotación."
                  : "Uniform anchors are placed first from the selected phase; remaining points repeatedly bisect the largest empty arc. This is not a rotation orbit."}</span>
              </Callout>
            </>
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
              className="btn primary"
              onClick={() => onSelectPreset(presets[0].id)}
            >
              <RefreshCcw size={15} />{" "}
              {es ? "Restaurar base" : "Restore baseline"}
            </button>
            <button
              className="btn"
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
        <div className="card certificate-panel">
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
                    "Certificado condicional: bajo la hipótesis declarada de irracionalidad, la comprobación finita cumple el límite de tres brechas. El cálculo no demuestra la irracionalidad.",
                  boundary:
                    scenario.alphaMode === "numeric"
                      ? "Entrada numérica: no se establece la irracionalidad. Se calcula la órbita finita sin afirmar el teorema."
                      : "Caso de frontera: entrada racional o con colisiones. No se afirma el teorema irracional.",
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
              note={
                certificate.theoremStatus === "certified"
                  ? es ? "límite ≤ 3" : "bound ≤ 3"
                  : certificate.scenario.alphaMode === "numeric"
                    ? es ? "sin hipótesis irracional" : "no irrationality claim"
                    : certificate.theoremStatus === "contrast"
                      ? es ? "no es una rotación" : "not a rotation orbit"
                      : es ? "frontera racional" : "rational boundary"
              }
              accent="var(--color-magenta)"
            />
            <Metric
              label={es ? "Residuo mayor" : "Largest residual"}
              value={formatNumber(certificate.sumCheck.residual, 7, es)}
              note={
                certificate.distinctCount === 3
                  ? certificate.sumCheck.relation
                  : es
                    ? "Sin relación aditiva en este estado de dos longitudes."
                    : "No additive relation in this two-length state."
              }
              accent="var(--color-accent)"
            />
          </div>
          <div className="equation-line">
            <InlineMath
              tex={
                certificate.theoremStatus === "certified"
                  ? certificate.distinctCount === 3 ? "c = a + b" : "D_N \\leq 3"
                  : certificate.scenario.alphaMode === "numeric"
                    ? es ? "\\text{hipótesis no verificada}" : "\\text{hypothesis unverified}"
                    : certificate.theoremStatus === "contrast"
                      ? es ? "\\text{no es una rotación}" : "\\text{not a rotation orbit}"
                      : es ? "\\text{frontera racional}" : "\\text{rational boundary}"
              }
            />
          </div>
        </div>
      </aside>
      <section className="main-visual">
        <div className="card visual-panel">
          <div className="visual-header">
            <div>
              <div className="panel-kicker">
                <CircleDot size={15} />{" "}
                {es ? "ÓRBITA PRINCIPAL" : "PRIMARY ORBIT"}
              </div>
              <h2>
                {es
                  ? "Partición circular de brechas"
                  : "Circular gap partition"}
              </h2>
            </div>
            <div className="alpha-readout">
              <span>α</span>
              <strong>{formatNumber(certificate.scenario.alpha, 6, es)}</strong>
              <small>
                {formatNumber(certificate.scenario.alpha * 360, 2, es)}°
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
              {certificate.groups.map((group) => (
                <span key={group.type}>
                  <i style={{ background: group.color }} />{group.type}
                </span>
              ))}
            </div>
            <span className="quiet">
              {certificate.theoremStatus === "certified" &&
              certificate.distinctCount === 3
                ? (es ? "c = a + b · arrastra o reproduce la secuencia" : "c = a + b · drag or play the sequence")
                : certificate.theoremStatus === "certified"
                  ? es
                    ? certificate.distinctCount + " longitudes observadas; la cota es tres."
                    : certificate.distinctCount + " distinct lengths observed; theorem bound is three."
                  : certificate.theoremStatus === "contrast"
                    ? es
                      ? "Clases observadas; el teorema no aplica a este asignador."
                      : "Observed classes; the theorem does not apply to this allocator."
                    : es
                      ? "Clases observadas; la irracionalidad no está establecida."
                      : "Observed classes; irrationality is not established."}
            </span>
          </div>
        </div>
        <div className="lower-grid">
          <div className="card">
            <div className="panel-title">
              <span>{es ? "Inventario de brechas" : "Gap inventory"}</span>
              <span className="quiet">
                {es ? "ordenado por longitud" : "sorted by length"}
              </span>
            </div>
            <GapInventory certificate={certificate} />
          </div>
          <div className="card lineage-card">
            <div className="panel-title">
              <span>{es ? "Genealogía de brechas" : "Gap genealogy"}</span>
              <GitBranch size={16} />
            </div>
            <div className="lineage-flow">
              {certificate.lineage.slice(1, 8).map((item) => (
                <div className="lineage-step" key={item.index}>
                  <b>{item.index}</b>
                  <span className="lineage-parent">
                    {formatNumber(item.parentLength, 3, es)}
                  </span>
                  <ArrowDownRight size={12} />
                  <span className="lineage-child">
                    {item.childLengths
                      ? formatNumber(item.childLengths[0], 3, es) +
                        " + " +
                        formatNumber(item.childLengths[1], 3, es)
                      : es
                        ? "colisión"
                        : "collision"}
                  </span>
                </div>
              ))}
            </div>
            <small className="quiet">
              {scenario.allocator === "rotation"
                ? es
                  ? "Cada punto nuevo de la rotación divide el intervalo que lo contiene."
                  : "Each new rotation point splits the interval containing it."
                : scenario.allocator === "farthest" || scenario.allocator === "anchors"
                  ? es
                    ? scenario.allocator === "anchors" ? "Las anclas se insertan primero y las posiciones restantes bisecan el mayor arco vacío." : "Cada punto nuevo es el punto medio del mayor arco vacío actual."
                    : scenario.allocator === "anchors" ? "Anchors are inserted first; remaining points bisect the largest empty arc." : "Each new point bisects the largest current empty arc."
                  : es
                    ? "La semilla genera cada punto; las divisiones se registran después del cálculo."
                    : "The seed generates each point; the resulting splits are recorded after computation."}
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
  const [a, b] = certificate.farey.left;
  const [c, d] = certificate.farey.right;
  const leftAlpha = a / b;
  const rightAlpha = c / d;
  const span = rightAlpha - leftAlpha;
  const x0 = 54;
  const x1 = 590;
  const y0 = 226;
  const y1 = 44;
  const lineSpecs = [
    { label: "a", value: (alpha: number) => b * alpha - a, count: scenario.pointCount - b, color: "var(--color-accent)" },
    { label: "b", value: (alpha: number) => c - d * alpha, count: scenario.pointCount - d, color: "var(--color-magenta)" },
    { label: "c", value: (alpha: number) => (b - d) * alpha + c - a, count: b + d - scenario.pointCount, color: "var(--color-warn)" },
  ].filter((line) => line.count > 0);
  const lineMax = Math.max(1e-9, ...lineSpecs.flatMap((line) => [line.value(leftAlpha), line.value(rightAlpha)]));
  const pointX = (alpha: number) => span > 1e-12 ? x0 + ((alpha - leftAlpha) / span) * (x1 - x0) : (x0 + x1) / 2;
  const pointY = (length: number) => y0 - (length / lineMax) * (y0 - y1);
  const cursor = pointX(scenario.alpha);
  return (
    <div className="deep-grid">
      <section className="card atlas-panel">
        <div className="panel-kicker">
          <Aperture size={15} />{" "}
          {es ? "ESPACIO DE PARÁMETROS DE HAMADA" : "HAMADA'S PARAMETER SPACE"}
        </div>
        <div className="deep-header">
          <div>
            <h2>
              {es
                ? "Celda de Farey para α y N actuales"
                : "Farey cell for the current α and N"}
            </h2>
            <p>{es
              ? "Las rectas se calculan con los vecinos racionales que delimitan la celda activa y el N actual. Cada pendiente y multiplicidad proviene de la fórmula de longitudes de Farey; el cursor marca el alfa seleccionado."
              : "The plotted lines are computed from the rational neighbours bounding the active cell at the current N. Each slope and multiplicity comes from the Farey gap formulas; the cursor marks the selected alpha."}</p>
          </div>
          <StatusBadge certificate={certificate} />
        </div>
        <svg
          className="atlas-svg"
          viewBox="0 0 640 290"
          role="img"
          aria-label={es ? "Longitudes de brecha de Farey dentro de la celda activa" : "Farey gap lengths inside the active cell"}
        >
          <rect
            x="0"
            y="0"
            width="640"
            height="290"
            rx="16"
            fill="var(--color-surface)"
          />
          {[0, 0.25, 0.5, 0.75, 1].map((fraction) => {
            const y = y0 - fraction * (y0 - y1);
            return <g key={fraction}><line x1={x0} x2={x1} y1={y} y2={y} stroke="var(--color-border)" strokeWidth="1" /><text x={x0 - 8} y={y + 4} textAnchor="end" fill="var(--color-fg-subtle)" fontSize="10">{formatNumber(lineMax * fraction, 3, es)}</text></g>;
          })}
          <line x1={x0} x2={x1} y1={y0} y2={y0} stroke="var(--color-fg-subtle)" />
          {lineSpecs.map((line) => {
            const value0 = Math.max(0, line.value(leftAlpha));
            const value1 = Math.max(0, line.value(rightAlpha));
            const current = Math.max(0, line.value(scenario.alpha));
            return <g key={line.label}><path d={`M ${x0} ${pointY(value0)} L ${x1} ${pointY(value1)}`} stroke={line.color} strokeWidth="3" fill="none" /><circle cx={cursor} cy={pointY(current)} r="4.5" fill={line.color} stroke="var(--color-surface)" strokeWidth="2" /><text x={x1 - 4} y={pointY(value1) - 7} textAnchor="end" fill={line.color} fontSize="11" fontWeight="700">{line.label} · ×{line.count}</text></g>;
          })}
          <line
            x1={cursor}
            x2={cursor}
            y1="18"
            y2="257"
            stroke="var(--color-fg)"
            strokeWidth="2"
          />
          <circle cx={cursor} cy="18" r="6" fill="var(--color-fg)" />
          <text x={x0} y="258" fill="var(--color-fg-subtle)" fontSize="11">{a}/{b}</text>
          <text x={x1} y="258" textAnchor="end" fill="var(--color-fg-subtle)" fontSize="11">{c}/{d}</text>
          <text x={cursor + 9} y="30" fill="var(--color-fg)" fontSize="11">
            α = {formatNumber(scenario.alpha, 4, es)}
          </text>
        </svg>
        <div className="atlas-axis">
          <span>{es ? `Celda activa para N = ${scenario.pointCount}` : `Active Farey cell at N = ${scenario.pointCount}`}</span>
          <span>{es ? "longitud normalizada en vueltas" : "normalized gap length in turns"}</span>
        </div>
      </section>
      <aside className="stack">
        <div className="card">
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
                  <strong>{formatNumber(item.length, 6, es)}</strong>
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
        <div className="card">
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
                  <small>{new Intl.NumberFormat(es ? "es-ES" : "en-US", { notation: "scientific", maximumSignificantDigits: 2, useGrouping: false }).format(item.error)}</small>
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
  setScenario,
}: {
  certificate: Certificate;
  scenario: Scenario;
  setScenario: (next: Scenario) => void;
}) {
  const es = useShellLang() === "es";
  const selected = certificate.dual.selected;
  return (
    <div className="deep-grid">
      <section className="card return-hero">
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
        <div className="return-controls">
          <Field
            label={es ? "Longitud del intervalo β" : "Target interval length β"}
            value={scenario.beta}
            onChange={(beta) => setScenario({ ...scenario, beta })}
            min={0.02}
            max={0.98}
            step={0.005}
          />
          <label className="select-field return-endpoint">
            <span>{es ? "Extremo del intervalo" : "Interval endpoint"}</span>
            <select
              value={scenario.strictBeta ? "strict" : "inclusive"}
              onChange={(event) =>
                setScenario({ ...scenario, strictBeta: event.target.value === "strict" })
              }
            >
              <option value="strict">{es ? "Semiabierto [0, β)" : "Half-open [0, β)"}</option>
              <option value="inclusive">{es ? "Cerrado [0, β]" : "Closed [0, β]"}</option>
            </select>
          </label>
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
        <div className="card">
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
        <div className="card">
          <div className="panel-kicker">
            <Info size={15} /> {es ? "CONVENCIÓN" : "CONVENTION"}
          </div>
          <p className="small-copy">
            {es
              ? "La convención elegida determina si una visita exactamente en β se incluye. Esta vista dual estudia saltos de índices, no las brechas geométricas primales del círculo."
              : "The selected convention determines whether a visit exactly at β is included. This dual view studies index jumps, not the primal geometric circle gaps."}
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
      <section className="card topology-panel">
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
            <p>{es
              ? "Aumente el umbral en la métrica de arco del círculo. Cada fusión ocurre en una brecha observada; el árbol generador mínimo contiene N−1 aristas y omite una brecha máxima, que cierra el ciclo sin matar una clase H₀."
              : "Raise the threshold in the circle's arc-length metric. Each merge occurs at an observed gap; the minimum spanning tree has N−1 edges and omits one largest gap, which closes the cycle without killing an H₀ class."}</p>
          </div>
          <Metric
            label={es ? "componentes" : "components"}
            value={String(certificate.topology.components)}
            note={(es ? "umbral " : "threshold ") + formatNumber(threshold, 4, es)}
            accent="var(--color-magenta)"
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
              <small>{formatNumber(bar.death, 4, es)}</small>
            </div>
          ))}
        </div>
        <div className="topology-events">
          {events.map((event) => (
            <button
              key={event.threshold}
              className={
                Math.abs(event.threshold - threshold) < 0.004 ? "is-active" : ""
              }
              onClick={() => setThreshold(event.threshold)}
            >
              <b>{formatNumber(event.threshold, 4, es)}</b>
              <span>
                {event.components} {es ? "componentes" : "components"}
              </span>
              <small>{es ? "arcos" : "gaps"}: {event.gapIds.join(", ")}</small>
            </button>
          ))}
        </div>
      </section>
      <aside className="stack">
        <div className="card">
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
            {es
              ? "Cada barra finita nace en cero y muere al cruzar una arista del árbol generador mínimo. Se usa la métrica intrínseca de arco en estos puntos muestreados; la brecha máxima se omite porque cierra el ciclo sin fusionar componentes."
              : "Each finite bar is born at zero and dies when a minimum-spanning-tree edge enters. This uses the intrinsic arc-length metric on the sampled points; the largest gap is omitted because it closes the cycle without merging components."}{" "}
          </p>
        </div>
        <Callout
          variant="honest"
          title={es ? "Topología acotada" : "Scoped topology"}
        >
          <span>{es
            ? "Certificado finito H₀ de conectividad con la métrica intrínseca del círculo. No es un motor general de homología persistente ni reproduce la aproximación de diagramas de persistencia para señales deslizantes."
            : "Finite H₀ connectivity certificate in the intrinsic circle metric. It is not a general persistent-homology engine and does not reproduce the sliding-window signal persistence approximation."}</span>
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
          ? "Palabra cíclica de tipos de brecha"
          : "Cyclic word of gap types"}
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
          ? "Representación reticular de la rotación"
          : "Lattice representation of the rotation"}
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
        <b>α = {formatNumber(scenario.alpha, 5, es)}</b>
      </div>
      <Refs ids={["marklof2017"]} label={es ? "Fuente" : "Source"} />
    </div>
  );
}

function TwoFrequencyView({ certificate }: { certificate: Certificate }) {
  const es = useShellLang() === "es";
  const plot = certificate.extension.points;
  const nearestEdges = plot.map((point, i) => {
    const candidates = plot.map((other, j) => {
      const rawX = other.x - point.x;
      const rawY = other.y - point.y;
      const dx = Math.abs(rawX) <= 0.5 ? rawX : rawX - Math.sign(rawX);
      const dy = Math.abs(rawY) <= 0.5 ? rawY : rawY - Math.sign(rawY);
      return { j, dx, dy, distance: Math.hypot(dx, dy) };
    }).filter(({ j }) => j !== i).sort((a, b) => a.distance - b.distance)[0];
    return { point, candidate: candidates };
  });
  return (
    <div className="two-frequency-view">
      <svg viewBox="0 0 320 320" role="img" aria-label={es
        ? "Secuencia de Kronecker sobre el toro cuadrado con aristas de vecino más cercano"
        : "Kronecker sequence on the square torus with nearest-neighbor edges"}>
        <rect x="34" y="32" width="248" height="248" className="two-frequency-ring" />
        {[0, 1, 2, 3, 4].map((tick) => <g key={tick}>
          <line x1={34 + tick * 62} y1="32" x2={34 + tick * 62} y2="280" className="torus-grid" />
          <line x1="34" y1={32 + tick * 62} x2="282" y2={32 + tick * 62} className="torus-grid" />
        </g>)}
        {nearestEdges.map(({ point, candidate }, index) => <line key={`edge-${index}`} x1={34 + point.x * 248} y1={280 - point.y * 248} x2={34 + (point.x + candidate.dx) * 248} y2={280 - (point.y + candidate.dy) * 248} className={`torus-nearest family-${point.group}`} />)}
        {plot.map((point, index) => <circle key={index} cx={34 + point.x * 248} cy={280 - point.y * 248} r="3.5" className={`two-frequency-point family-${point.group}`} />)}
      </svg>
      <div className="torus-readout">
        <div className="torus-readout-heading">
          <strong>{es ? "Distancias mínimas observadas" : "Observed nearest distances"}</strong>
          <span>{es ? "métrica euclídea periódica" : "periodic Euclidean metric"} · N = {plot.length} · v = (α, β)</span>
        </div>
        <div className="torus-distance-list">{certificate.extension.groups.map((group, i) => <div className="torus-distance-row" key={group.type}>
          <span className={`torus-distance-key family-${i}`}>{group.type}</span>
          <span>{formatNumber(group.length, 4, es)}</span>
          <span>{es ? "puntos" : "points"} × {group.count}</span>
        </div>)}</div>
      </div>
      <Refs ids={["haynesmarklof2020"]} label={es ? "Referencia · distancias vecinas en dimensión 2" : "Reference · nearest-neighbor distances in dimension 2"} />
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
            <Metric label="D*N" value={formatNumber(discrepancy, 6, es)} />
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
          <h3>{es ? "Recuentos de brechas por proceso de generación" : "Gap counts by point-generation process"}</h3>
          <p>{es
            ? "La rotación es aritmética; la inserción más lejana optimiza espacio vacío. El contraste toroidal usa (nα, nβ) mod 1 y distancias euclídeas periódicas entre vecinos más cercanos; es un teorema distinto y no una generalización de las brechas circulares."
            : "Rotation is arithmetic; farthest-point insertion optimizes empty space. The torus contrast uses (nα, nβ) mod 1 and periodic Euclidean nearest-neighbor distances; this is a separate theorem, not a generalization of circular gaps."}</p>
          <TwoFrequencyView certificate={certificate} />
          <div className="contrast-grid">
            {[
              { label: es ? "rotación" : "rotation", value: certificate.distinctCount, tone: "b" },
              { label: es ? "clases vecinas en toro" : "torus neighbor classes", value: certificate.extension.distinctCount, tone: "c" },
              { label: es ? "punto más lejano" : "farthest point", value: computeCertificate({ ...scenario, allocator: "farthest" }).distinctCount, tone: "a" },
              { label: es ? "anclas" : "anchors", value: computeCertificate({ ...scenario, allocator: "anchors" }).distinctCount, tone: "b" },
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

export function GapTheoWorkbench() {
  const [scenario, setScenario] = useState<Scenario>(initialScenario);
  const [selectedId, setSelectedId] = useState(presets[0].id);
  const [threshold, setThreshold] = useState(0.03);
  const certificate = useMemo(
    () => computeCertificate(scenario, threshold),
    [scenario, threshold],
  );
  const lang = useShellLang();
  const es = lang === "es";
  const selectPreset = (id: string) => {
    const preset = presets.find((item) => item.id === id) ?? presets[0];
    setSelectedId(preset.id);
    setScenario(scenarioFromPreset(preset));
    setThreshold(0.03);
  };
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
          onSelectPreset={selectPreset}
        />
      ),
    },
    {
      id: "atlas",
      label: es ? "Certificado Farey / FC" : "Farey / CF certificate",
      content: <ProofAtlas certificate={certificate} scenario={scenario} />,
    },
    {
      id: "return",
      label: es ? "Retornos" : "Return Gaps",
      content: <ReturnGaps certificate={certificate} scenario={scenario} setScenario={setScenario} />,
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
    <SurfacePage
      title={{ en: "Finite circle rotations", es: "Rotaciones finitas del círculo" }}
      lede={es
        ? "Ajusta alfa, fase y N para inspeccionar la partición circular y sus certificados."
        : "Adjust α, phase, and N to inspect the circular partition and its certificates."}
      ariaLabel={es ? "Lecturas de la órbita" : "Orbit readings"}
      instrument
      focus
      tabs={tabs.map((tab) => ({ ...tab, focus: true }))}
    />
  );
}
