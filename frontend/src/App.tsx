import { useMemo, useState, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import {
  AppShell,
  Callout,
  Cite,
  CitationsProvider,
  Equation,
  InlineMath,
  LanguageToggle,
  ReferenceList,
  Refs,
  ThemeToggle,
  usePausedViz,
  useShellLang,
} from '@fasl-work/caos-app-shell';
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
} from 'lucide-react';
import {
  type Certificate,
  type Scenario,
  computeCertificate,
  frac,
  polar,
} from './core/gapEngine';

const citations = [
  { id: 'hamada', label: 'Hamada 2024', citation: 'T. Hamada, A concise geometric proof of the three distance theorem, arXiv:2308.11999.', url: 'https://arxiv.org/abs/2308.11999' },
  { id: 'berthe', label: 'Alessandri and Berthé', citation: 'V. Alessandri and V. Berthé, Three distance theorems and combinatorics on words.', url: 'https://www.irif.fr/~berthe/Articles/3d.pdf' },
  { id: 'marklof', label: 'Marklof and Strömbergsson', citation: 'J. Marklof and A. Strömbergsson, The three gap theorem and the space of lattices.', url: 'https://arxiv.org/abs/1612.04906' },
  { id: 'taha', label: 'Taha 2018', citation: 'A. Taha, The Three Gap Theorem, Interval Exchange Transformations, and Zippered Rectangles.', url: 'https://arxiv.org/abs/1708.04380' },
  { id: 'symmetry', label: 'Dasgupta and Roeder', citation: 'A. Dasgupta and D. Roeder, Symmetries of the Three-Gap Theorem.', url: 'https://doi.org/10.1080/00029890.2022.2158021' },
  { id: 'topology', label: 'Suarez Salas and Perea', citation: 'L. Suarez Salas and J. A. Perea, Estimation of Persistence Diagrams via the Three Gap Theorem.', url: 'https://arxiv.org/abs/2603.04570' },
];

const initialScenario: Scenario = {
  alpha: (Math.sqrt(5) - 1) / 2,
  alphaMode: 'irrational',
  rationalP: 5,
  rationalQ: 13,
  pointCount: 34,
  phase: 0,
  beta: 0.31,
  allocator: 'rotation',
  seed: 17,
  anchorCount: 1,
  strictBeta: true,
};

type Tab = 'explore' | 'atlas' | 'return' | 'topology' | 'extensions';

function formatNumber(value: number, digits = 5): string {
  return Number.isFinite(value) ? value.toFixed(digits) : 'n/a';
}

function Field({ label, value, onChange, min, max, step, suffix }: { label: string; value: number; onChange: (value: number) => void; min: number; max: number; step: number; suffix?: string }) {
  return (
    <label className="field">
      <span>{label}<b>{formatNumber(value, step < 0.01 ? 4 : 2)}{suffix ?? ''}</b></span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} />
    </label>
  );
}

function Segmented({ value, options, onChange }: { value: string; options: Array<{ value: string; label: string }>; onChange: (value: string) => void }) {
  return <div className="segmented" role="group">{options.map((option) => <button key={option.value} className={value === option.value ? 'active' : ''} onClick={() => onChange(option.value)}>{option.label}</button>)}</div>;
}

function StatusBadge({ certificate }: { certificate: Certificate }) {
  const label = certificate.theoremStatus === 'certified' ? 'CERTIFIED' : certificate.theoremStatus.toUpperCase();
  return <span className={'status-badge ' + certificate.theoremStatus}><i />{label}</span>;
}

function Metric({ label, value, note, accent }: { label: string; value: string; note?: string; accent?: string }) {
  return <div className="metric"><span>{label}</span><strong style={{ color: accent }}>{value}</strong>{note && <small>{note}</small>}</div>;
}

function GapInventory({ certificate, dual = false }: { certificate: Certificate; dual?: boolean }) {
  const groups = dual ? certificate.dual.groups : certificate.groups;
  return <div className="gap-inventory">{groups.map((group) => <div className="gap-row" key={group.type}><span className="gap-token" style={{ background: group.color }}>{group.type}</span><div className="gap-track"><span style={{ width: Math.max(8, group.share * 100) + '%', background: group.color }} /></div><strong>{formatNumber(group.length, 5)}</strong><small>{group.count} ×</small></div>)}</div>;
}

function CircleOrbit({ certificate, step, setStep }: { certificate: Certificate; step: number; setStep: (step: number) => void }) {
  const [playing, setPlaying] = useState(false);
  const controller = usePausedViz((_dt, elapsed) => {
    const next = Math.min(certificate.points.length, 1 + Math.floor(elapsed / 90));
    setStep(next);
    if (next >= certificate.points.length) {
      setPlaying(false);
      return false;
    }
    return true;
  }, { durationMs: Math.max(500, certificate.points.length * 90), autoStart: false, onComplete: () => setPlaying(false) });
  const visible = certificate.points.slice(0, Math.max(1, Math.min(step, certificate.points.length)));
  const sorted = [...visible].sort((a, b) => a.value - b.value);
  const circleGaps = sorted.map((point, index) => {
    const next = sorted[(index + 1) % sorted.length];
    return { start: point.value, end: next.value, length: index === sorted.length - 1 ? 1 - point.value + next.value : next.value - point.value };
  });
  const pointsToDraw = sorted.map((point) => ({ point, xy: polar(point.value, 183, 260) }));
  const play = () => {
    if (step >= certificate.points.length) setStep(1);
    controller.toggle();
    setPlaying(!playing);
  };
  return <div className="orbit-stage">
    <svg viewBox="0 0 520 520" role="img" aria-label="Animated orbit on the unit circle">
      <defs><radialGradient id="orbitGlow"><stop offset="0" stopColor="#58d2c2" stopOpacity=".18" /><stop offset="1" stopColor="#58d2c2" stopOpacity="0" /></radialGradient></defs>
      <circle cx="260" cy="260" r="224" fill="url(#orbitGlow)" />
      <circle cx="260" cy="260" r="184" className="orbit-ring" />
      {circleGaps.map((gap, index) => {
        const [x1, y1] = polar(gap.start, 184, 260);
        const [x2, y2] = polar(gap.end, 184, 260);
        const mid = frac(gap.start + gap.length / 2);
        const [lx, ly] = polar(mid, 202, 260);
        const gapColor = certificate.groups.find((group) => Math.abs(group.length - gap.length) < 1e-8)?.color ?? '#789';
        const path = 'M ' + x1 + ' ' + y1 + ' A 184 184 0 ' + (gap.length > 0.5 ? 1 : 0) + ' 1 ' + x2 + ' ' + y2;
        return <g key={index}><path d={path} className="gap-arc" style={{ stroke: gapColor }} /><text x={lx} y={ly} className="arc-label">{formatNumber(gap.length, 3)}</text></g>;
      })}
      {pointsToDraw.map(({ point, xy }) => <g key={point.id}><circle cx={xy[0]} cy={xy[1]} r={point.index === step - 1 ? 8 : 4.5} className={point.index === step - 1 ? 'orbit-point selected' : 'orbit-point'} /><text x={xy[0]} y={xy[1] - 12} className="point-index">{point.index}</text></g>)}
      <circle cx="260" cy="260" r="5" className="center-dot" />
      <text x="260" y="250" textAnchor="middle" className="center-label">R / Z</text>
      <text x="260" y="275" textAnchor="middle" className="center-sub">rotation orbit</text>
    </svg>
    <div className="orbit-controls">
      <button className="icon-button primary" onClick={play} aria-label={playing ? 'Pause orbit' : 'Play orbit'}>{playing ? <Pause size={16} /> : <Play size={16} />}</button>
      <button className="icon-button" onClick={() => { controller.pause(); setPlaying(false); setStep(1); }} aria-label="Reset orbit"><RefreshCcw size={16} /></button>
      <input aria-label="Orbit step" type="range" min={1} max={certificate.points.length} value={step} onChange={(event) => { controller.pause(); setPlaying(false); setStep(Number(event.target.value)); }} />
      <span className="mono">{String(step).padStart(2, '0')} / {certificate.points.length}</span>
    </div>
  </div>;
}

function Explore({ certificate, scenario, setScenario }: { certificate: Certificate; scenario: Scenario; setScenario: (next: Scenario) => void }) {
  const [step, setStep] = useState(scenario.pointCount);
  const update = (patch: Partial<Scenario>) => { setScenario({ ...scenario, ...patch }); setStep(Math.min(scenario.pointCount, patch.pointCount ?? scenario.pointCount)); };
  return <div className="workbench-grid">
    <aside className="control-column">
      <div className="panel control-panel">
        <div className="panel-kicker"><SlidersHorizontal size={15} /> LIVE PARAMETERS</div>
        <div className="control-heading"><h2>Seed the orbit</h2><p>Every slider updates the same certificate, circle, word, and topology views.</p></div>
        <label className="select-field"><span>Process</span><select value={scenario.allocator} onChange={(event) => update({ allocator: event.target.value as Scenario['allocator'] })}><option value="rotation">Arithmetic rotation</option><option value="random">Seeded random</option><option value="farthest">Farthest-point allocator</option></select></label>
        <Segmented value={scenario.alphaMode} onChange={(value) => update({ alphaMode: value as Scenario['alphaMode'] })} options={[{ value: 'irrational', label: 'Irrational' }, { value: 'numeric', label: 'Numeric' }, { value: 'rational', label: 'p / q' }]} />
        {scenario.alphaMode === 'rational' ? <div className="fraction-inputs"><label><span>p</span><input type="number" value={scenario.rationalP} onChange={(event) => update({ rationalP: Number(event.target.value) })} /></label><span>/</span><label><span>q</span><input type="number" value={scenario.rationalQ} onChange={(event) => update({ rationalQ: Number(event.target.value) })} /></label></div> : <Field label="Angle step alpha" value={scenario.alpha} onChange={(value) => update({ alpha: value })} min={0.05} max={0.95} step={0.0005} suffix=" turns" />}
        <Field label="Points N" value={scenario.pointCount} onChange={(value) => update({ pointCount: value })} min={3} max={120} step={1} />
        <Field label="Phase offset" value={scenario.phase} onChange={(value) => update({ phase: value })} min={0} max={0.99} step={0.005} suffix=" turns" />
        <Field label="Target beta" value={scenario.beta} onChange={(value) => update({ beta: value })} min={0.05} max={0.9} step={0.005} />
        {scenario.allocator === 'random' && <Field label="Deterministic seed" value={scenario.seed} onChange={(value) => update({ seed: value })} min={1} max={999} step={1} />}
        {scenario.allocator === 'farthest' && <Callout variant="honest" title="Contrast process"><span>Midpoints of the largest empty arc are allocated greedily. This is intentionally outside arithmetic rotation.</span></Callout>}
        <div className="control-actions"><button className="button primary" onClick={() => setScenario({ ...initialScenario })}><RefreshCcw size={15} /> Restore baseline</button><button className="button ghost" onClick={() => setScenario({ ...scenario, phase: frac(scenario.phase + scenario.alpha) })}>Advance phase <ArrowDownRight size={15} /></button></div>
      </div>
      <div className="panel certificate-panel">
        <div className="panel-kicker"><Gauge size={15} /> CERTIFICATE</div>
        <div className="certificate-top"><StatusBadge certificate={certificate} /><span className="mono">N = {certificate.points.length}</span></div>
        <p>{certificate.theoremMessage}</p>
        <div className="metric-grid"><Metric label="Distinct gaps" value={String(certificate.distinctCount)} note="bound ≤ 3" accent="#58d2c2" /><Metric label="Largest residual" value={formatNumber(certificate.sumCheck.residual, 7)} note="c − a − b" accent="#f1b66e" /></div>
        <div className="equation-line"><InlineMath tex={certificate.distinctCount === 3 ? 'c = a + b' : 'D_N \\leq 3'} /></div>
      </div>
    </aside>
    <section className="main-visual">
      <div className="panel visual-panel">
        <div className="visual-header"><div><div className="panel-kicker"><CircleDot size={15} /> PRIMARY ORBIT</div><h2>One rotation, many readings</h2></div><div className="alpha-readout"><span>α</span><strong>{formatNumber(certificate.scenario.alpha, 6)}</strong><small>{formatNumber(certificate.scenario.alpha * 360, 2)}°</small></div></div>
        <CircleOrbit certificate={certificate} step={step} setStep={setStep} />
        <div className="visual-footer"><div className="legend"><span><i style={{ background: '#f1b66e' }} />a</span><span><i style={{ background: '#58d2c2' }} />b</span><span><i style={{ background: '#d98cff' }} />c = a + b</span></div><span className="quiet">Drag the step handle or play the split sequence</span></div>
      </div>
      <div className="lower-grid"><div className="panel"><div className="panel-title"><span>Gap inventory</span><span className="quiet">sorted by length</span></div><GapInventory certificate={certificate} /></div><div className="panel lineage-card"><div className="panel-title"><span>Gap genealogy</span><GitBranch size={16} /></div><div className="lineage-flow">{certificate.lineage.slice(1, 8).map((item) => <div className="lineage-step" key={item.index}><b>{item.index}</b><span className="lineage-parent">{formatNumber(item.parentLength, 3)}</span><ArrowDownRight size={12} /><span className="lineage-child">{item.childLengths ? formatNumber(item.childLengths[0], 3) + ' + ' + formatNumber(item.childLengths[1], 3) : 'collision'}</span></div>)}</div><small className="quiet">Each new arithmetic point splits one existing empty arc.</small></div></div>
    </section>
  </div>;
}

function ProofAtlas({ certificate, scenario }: { certificate: Certificate; scenario: Scenario }) {
  const cells = Array.from({ length: 14 }, (_, index) => ({ x: 0.08 + index * 0.062, width: 0.055 + (index % 3) * 0.012, shade: index % 2 }));
  const cursor = 52 + scenario.alpha * 540;
  return <div className="deep-grid"><section className="panel atlas-panel"><div className="panel-kicker"><Aperture size={15} /> HAMADA'S PARAMETER SPACE</div><div className="deep-header"><div><h2>The theorem as a moving cell</h2><p>At fixed N, the alpha-height diagram changes combinatorial type only at Farey events. The live cursor is not decoration: it reads the exact candidate lengths below.</p></div><StatusBadge certificate={certificate} /></div><svg className="atlas-svg" viewBox="0 0 640 290" role="img" aria-label="Farey parameter atlas"><defs><linearGradient id="atlas-bg" x1="0" x2="1"><stop stopColor="#0c1c27" /><stop offset="1" stopColor="#102d36" /></linearGradient></defs><rect x="0" y="0" width="640" height="290" rx="16" fill="url(#atlas-bg)" />{cells.map((cell, i) => <g key={i}><rect x={cell.x * 640} y={34 + (i % 2) * 18} width={cell.width * 640} height={215 - (i % 4) * 22} fill={cell.shade ? '#58d2c2' : '#f1b66e'} opacity=".08" /><line x1={cell.x * 640} y1="28" x2={cell.x * 640 + cell.width * 640} y2="248" stroke={cell.shade ? '#58d2c2' : '#f1b66e'} opacity=".22" strokeDasharray="3 5" /></g>)}{[0, 1, 2].map((i) => <path key={i} d={'M 20 ' + (236 - i * 58) + ' C 180 ' + (220 - i * 34) + ', 340 ' + (170 - i * 20) + ', 620 ' + (45 + i * 42)} stroke={['#f1b66e', '#58d2c2', '#d98cff'][i]} strokeWidth="2" fill="none" opacity=".85" />)}<line x1={cursor} x2={cursor} y1="18" y2="257" stroke="#fff4dc" strokeWidth="2" /><circle cx={cursor} cy="18" r="6" fill="#fff4dc" /><text x="22" y="276" fill="#a4b9ba" fontSize="11">0</text><text x="600" y="276" fill="#a4b9ba" fontSize="11">1</text><text x={cursor + 9} y="30" fill="#fff4dc" fontSize="11">α = {formatNumber(scenario.alpha, 4)}</text></svg><div className="atlas-axis"><span>Farey cells of order N</span><span>height h = fractional part</span></div></section><aside className="stack"><div className="panel"><div className="panel-title"><span>Active Farey bracket</span><span className="mono">{certificate.farey.left[0]}/{certificate.farey.left[1]} &lt; α &lt; {certificate.farey.right[0]}/{certificate.farey.right[1]}</span></div><div className="formula-list">{certificate.farey.candidates.map((item) => <div className="formula-row" key={item.label}><span className="gap-token" style={{ background: item.color }}>{item.label}</span><div><strong>{formatNumber(item.length, 6)}</strong><small>candidate length</small></div><b>{item.count}</b><small>multiplicity</small></div>)}</div><Callout variant="strong" title="Exact relation"><span>The third candidate is the sum of the first two whenever the three-candidate cell is active.</span></Callout></div><div className="panel"><div className="panel-title"><span>Continued fraction</span><span className="mono">convergents</span></div><div className="continued-row">{certificate.continuedFraction.convergents.slice(1, 6).map((item) => <span key={item.q}><b>{item.p}/{item.q}</b><small>{item.error.toExponential(1)}</small></span>)}</div><Refs ids={['hamada', 'berthe']} label="Sources" /></div></aside></div>;
}

function ReturnGaps({ certificate, scenario }: { certificate: Certificate; scenario: Scenario }) {
  const selected = certificate.dual.selected.slice(0, 22);
  return <div className="deep-grid"><section className="panel return-hero"><div className="panel-kicker"><Target size={15} /> DUAL RETURN TIMES</div><div className="deep-header"><div><h2>Visits below beta</h2><p>Instead of looking at every adjacent point, select indices whose orbit lands in the target interval [0, β). Their index jumps form a second three-gap phenomenon.</p></div><span className="regime-badge">{certificate.dual.regime}</span></div><div className="return-track"><div className="target-band" style={{ width: certificate.scenario.beta * 100 + '%' }}><span>target [0, β)</span></div>{selected.map((index, i) => <span key={index} className="visit-mark" style={{ left: frac(index * scenario.alpha + scenario.phase) * 100 + '%' }} title={'visit index ' + index}><i />{i < 8 && <small>{index}</small>}</span>)}</div><div className="return-sequence">{selected.slice(0, 12).map((index, i) => <div key={index} className="return-node"><span>{index}</span>{i < 11 && <ArrowDownRight size={14} />}</div>)}</div></section><aside className="stack"><div className="panel"><div className="panel-title"><span>Return-gap inventory</span><span className="quiet">index differences</span></div><GapInventory certificate={certificate} dual /></div><div className="panel"><div className="panel-kicker"><Info size={15} /> CONVENTION</div><p className="small-copy">The strict boundary excludes a visit exactly at beta. Toggle this convention in the experiment source to see endpoint sensitivity. This panel is a dual theorem view, not another claim about the primal circle gaps.</p><Refs ids={['hamada', 'berthe']} label="Sources" /></div></aside></div>;
}

function Topology({ certificate, threshold, setThreshold }: { certificate: Certificate; threshold: number; setThreshold: (value: number) => void }) {
  const events = certificate.topology.events;
  return <div className="deep-grid"><section className="panel topology-panel"><div className="panel-kicker"><Layers3 size={15} /> ZERO-DIMENSIONAL RIPS LENS</div><div className="deep-header"><div><h2>Connectivity appears at gap lengths</h2><p>Raise a threshold on the sampled circle. Every merge is tied to an actual nearest-neighbor gap, so the topology view stays traceable to the orbit.</p></div><Metric label="components" value={String(certificate.topology.components)} note={'threshold ' + formatNumber(threshold, 4)} accent="#58d2c2" /></div><div className="topology-slider"><Field label="Filtration threshold" value={threshold} onChange={setThreshold} min={0.001} max={Math.max(0.06, Math.max(...certificate.gaps.map((gap) => gap.length)))} step={0.001} /></div><div className="merge-tree">{certificate.topology.bars.slice(0, 20).map((bar, index) => <div className="bar-row" key={bar.id}><span>{index + 1}</span><div className="bar-track"><i style={{ width: Math.min(100, bar.death * 100) + '%', background: certificate.groups[index % certificate.groups.length]?.color }} /></div><small>{formatNumber(bar.death, 4)}</small></div>)}</div><div className="topology-events">{events.map((event) => <button key={event.threshold} className={Math.abs(event.threshold - threshold) < 0.004 ? 'active' : ''} onClick={() => setThreshold(event.threshold)}><b>{formatNumber(event.threshold, 4)}</b><span>{event.components} components</span></button>)}</div></section><aside className="stack"><div className="panel"><div className="panel-title"><span>Reading the barcode</span><Activity size={16} /></div><div className="barcode">{certificate.topology.bars.slice(0, 14).map((bar, index) => <div key={bar.id} style={{ left: '3%', width: Math.max(5, bar.death * 94) + '%', top: index * 18 + 'px', background: certificate.groups[index % certificate.groups.length]?.color }} />)}</div><p className="small-copy">Each horizontal bar starts at 0 and dies at a circular gap length. This is the finite 0D interpretation described by <Cite id="topology" paren />.</p></div><Callout variant="honest" title="Scoped topology"><span>This is a transparent finite 0D Rips certificate. It is not a general-purpose persistent-homology engine.</span></Callout></aside></div>;
}

function WordView({ certificate }: { certificate: Certificate }) {
  const word = certificate.word.word;
  return <div className="extension-card full"><div className="panel-kicker"><Waypoints size={15} /> COMBINATORICS ON WORDS</div><h3>The circle as a cyclic sentence</h3><p>Gap types become a word around the circle. The largest-gap anchor gives a local symmetry probe, inspired by the matching structure studied by Dasgupta and Roeder.</p><div className="word-ribbon">{word.split('').map((letter, index) => <span key={index} style={{ background: certificate.word.palette[letter] }}>{letter}</span>)}</div><div className="word-meta"><Metric label="word length" value={String(word.length)} /><Metric label="alphabet" value={String(certificate.groups.length)} /><Metric label="matched around anchor" value={certificate.word.symmetry.matched + ' / ' + certificate.word.symmetry.total} /></div><Refs ids={['symmetry', 'berthe']} label="Sources" /></div>;
}

function LatticeView({ certificate, scenario }: { certificate: Certificate; scenario: Scenario }) {
  return <div className="extension-card"><div className="panel-kicker"><Grid3X3 size={15} /> SPACE OF LATTICES</div><h3>One orbit, one lattice window</h3><p>Rotation data can be lifted to a unimodular lattice. Active short vectors are highlighted; the direct circle certificate remains the reference.</p><svg viewBox="0 0 360 260" className="lattice-svg">{Array.from({ length: 9 }, (_, i) => <line key={'v-' + i} x1={20 + i * 40} y1="16" x2={20 + i * 40} y2="244" stroke="currentColor" opacity=".12" />)}{Array.from({ length: 6 }, (_, i) => <line key={'h-' + i} x1="20" y1={24 + i * 40} x2="340" y2={24 + i * 40} stroke="currentColor" opacity=".12" />)}{certificate.lattice.map((vector, index) => <circle key={index} cx={180 + vector.x * 22} cy={130 - vector.y * 22} r={vector.active ? 5 : 2.3} className={vector.active ? 'lattice-active' : 'lattice-dot'} />)}<circle cx="180" cy="130" r="4" className="center-dot" /></svg><div className="lattice-readout"><span>active shortest-vector shell</span><b>α = {formatNumber(scenario.alpha, 5)}</b></div><Refs ids={['marklof']} label="Source" /></div>;
}

function Extensions({ certificate, scenario }: { certificate: Certificate; scenario: Scenario }) {
  const [view, setView] = useState('word');
  return <div className="extension-layout"><div className="extension-tabs">{[{ id: 'word', label: 'Gap word', icon: Waypoints }, { id: 'lattice', label: 'Lattice', icon: Grid3X3 }, { id: 'exchange', label: '2-IET', icon: GitBranch }, { id: 'contrast', label: 'Contrasts', icon: Dna }].map(({ id, label, icon: Icon }) => <button key={id} className={view === id ? 'active' : ''} onClick={() => setView(id)}><Icon size={16} />{label}</button>)}</div>{view === 'word' && <WordView certificate={certificate} />}{view === 'lattice' && <LatticeView certificate={certificate} scenario={scenario} />}{view === 'exchange' && <div className="extension-card full"><div className="panel-kicker"><GitBranch size={15} /> INTERVAL EXCHANGE</div><h3>Rotation is a two-interval exchange</h3><div className="exchange-diagram"><div className="exchange-line"><span style={{ width: (1 - scenario.alpha) * 100 + '%' }}>I₁</span><span style={{ width: scenario.alpha * 100 + '%' }}>I₂</span></div><ArrowDownRight size={26} /><div className="exchange-line reversed"><span style={{ width: scenario.alpha * 100 + '%' }}>I₂</span><span style={{ width: (1 - scenario.alpha) * 100 + '%' }}>I₁</span></div></div><p>Cut the circle at the orbit origin, rotate by alpha, and reassemble two intervals. The zippered-rectangle view is a geometric extension, not a new certificate for arbitrary exchanges.</p><Refs ids={['taha', 'berthe']} label="Sources" /></div>}{view === 'contrast' && <div className="extension-card full"><div className="panel-kicker"><Dna size={15} /> CONTROLLED CONTRASTS</div><h3>Change the process, watch the bound change</h3><p>Rotation is arithmetic. Farthest-point insertion optimizes empty space. Two-frequency sampling creates a different Kronecker-style experiment. These controls are designed to test assumptions, not to manufacture a failure.</p><div className="contrast-grid">{[{ label: 'rotation', value: certificate.distinctCount, color: '#58d2c2' }, { label: 'two-frequency', value: certificate.extension.distinctCount, color: '#d98cff' }, { label: 'farthest point', value: computeCertificate({ ...scenario, allocator: 'farthest' }).distinctCount, color: '#f1b66e' }].map((item) => <div key={item.label} className="contrast-stat"><span>{item.label}</span><strong style={{ color: item.color }}>{item.value}</strong><small>distinct gaps</small></div>)}</div><Callout variant="honest" title="Boundary preserved"><span>Higher-dimensional and allocator results are comparison experiments. The classical three-gap badge applies only to the declared rotation regime.</span></Callout><Refs ids={['berthe', 'marklof']} label="Sources" /></div>}</div>;
}

function App() {
  const [scenario, setScenario] = useState<Scenario>(initialScenario);
  const [tab, setTab] = useState<Tab>('explore');
  const [threshold, setThreshold] = useState(0.03);
  const certificate = useMemo(() => computeCertificate(scenario, threshold), [scenario, threshold]);
  const lang = useShellLang();
  const labels = lang === 'es'
    ? { explore: 'Explorar', atlas: 'Atlas de prueba', return: 'Retornos', topology: 'Topología', extensions: 'Extensiones' }
    : { explore: 'Explore', atlas: 'Proof Atlas', return: 'Return Gaps', topology: 'Topology', extensions: 'Extensions' };
  const shellConfig = {
    product: { name: 'GapTheo', mark: <Sparkles size={18} /> },
    routes: [
      { path: '/', en: 'Workbench', es: 'Laboratorio' },
      { path: '/introduction', en: 'Introduction', es: 'Introducción' },
      { path: '/methodology', en: 'Methodology', es: 'Metodología' },
      { path: '/experiments', en: 'Experiments', es: 'Experimentos' },
      { path: '/references', en: 'References', es: 'Referencias' },
    ],
    links: { github: 'https://github.com/fsantibanezleal/CAOS_RES_GapTheo', personal: 'https://fasl-work.com', portfolio: 'https://www.fasl-work.com' },
    version: '0.01.000',
    fixedRoutes: ['/'],
    architecture: {
      tabs: [
        { id: 'live', en: 'Live lane', es: 'Capa viva', body_en: 'TypeScript recomputes the finite orbit, gaps, topology, and linked certificates in the browser.', body_es: 'TypeScript recalcula la órbita finita, las brechas, la topología y los certificados vinculados en el navegador.', svg: '<svg viewBox="0 0 400 120"><path d="M20 90 C100 20 180 100 260 30 S350 70 380 25" stroke="#58d2c2" fill="none" stroke-width="3"/><circle cx="100" cy="55" r="5" fill="#f1b66e"/><circle cx="260" cy="30" r="5" fill="#d98cff"/></svg>' },
        { id: 'proof', en: 'Proof boundary', es: 'Límite de la prueba', body_en: 'The direct sorted-orbit oracle is primary. Rational inputs, allocators, topology, and higher-dimensional views are labelled boundaries or contrasts.', body_es: 'El oráculo directo de la órbita ordenada es primario. Las entradas racionales, asignadores, topología y vistas de mayor dimensión están marcadas como límites o contrastes.', svg: '<svg viewBox="0 0 400 120"><rect x="20" y="30" width="110" height="60" rx="10" fill="#58d2c2" opacity=".25"/><rect x="145" y="30" width="110" height="60" rx="10" fill="#f1b66e" opacity=".25"/><rect x="270" y="30" width="110" height="60" rx="10" fill="#d98cff" opacity=".25"/><text x="75" y="66" fill="currentColor" text-anchor="middle">direct</text><text x="200" y="66" fill="currentColor" text-anchor="middle">derived</text><text x="325" y="66" fill="currentColor" text-anchor="middle">boundary</text></svg>' },
      ],
    },
    footer: {
      attribution: { en: 'Built by Felipe Santibáñez-Leal', es: 'Construido por Felipe Santibáñez-Leal' },
      license: { en: 'MIT licensed research software', es: 'Software de investigación bajo licencia MIT' },
      provenance: { en: 'Engine: deterministic finite rotation certificates', es: 'Motor: certificados deterministas de rotación finita' },
      disclaimer: { en: 'Runs locally in your browser; no account or server is required.', es: 'Se ejecuta localmente en tu navegador; no requiere cuenta ni servidor.' },
    },
  };
  return <CitationsProvider items={citations}><AppShell config={shellConfig}><RoutesView tab={tab} setTab={setTab} labels={labels} scenario={scenario} setScenario={setScenario} certificate={certificate} threshold={threshold} setThreshold={setThreshold} /></AppShell></CitationsProvider>;
}

function ResearchPage({ path }: { path: string }) {
  const lang = useShellLang();
  const title = path === '/methodology' ? (lang === 'es' ? 'Metodología' : 'Methodology')
    : path === '/experiments' ? (lang === 'es' ? 'Experimentos controlados' : 'Controlled experiments')
      : path === '/references' ? (lang === 'es' ? 'Referencias' : 'References')
        : (lang === 'es' ? 'Introducción' : 'Introduction');
  if (path === '/references') return <main className="deep-page"><div className="deep-page-inner"><span className="eyebrow">READING ROOM</span><h1>{title}</h1><p>Primary sources for the three-gap theorem and its visual extensions.</p><div className="panel reference-panel"><ReferenceList /></div></div></main>;
  return <main className="deep-page"><div className="deep-page-inner"><span className="eyebrow">GAPTHEO / {path.slice(1).toUpperCase()}</span><h1>{title}</h1>{path === '/methodology' ? <><p>GapTheo keeps one direct oracle in view while derived structures explain why the orbit has its observed shape. The browser uses exact integer residues for rational inputs, documented tolerances for numeric inputs, and cross-method checks for canonical scenarios.</p><h2>Three-lane computation</h2><p>The analytic reference lane creates deterministic certificates, the live lane recomputes bounded scenarios in TypeScript, and the replay lane provides stable fixtures for the narrative. There is no learned model and no server-side inference.</p><Equation tex={'D_N \\leq 3'} caption="The classical bound for the declared irrational rotation regime." /><Callout variant="honest" title="Boundary"><span>A finite decimal is never labelled mathematically irrational. Rational, allocator, and higher-dimensional modes are explicit boundaries.</span></Callout></> : path === '/experiments' ? <><p>Use the workbench to compare arithmetic rotation with seeded random placement, farthest-point insertion, dual return times, and a two-frequency extension.</p><h2>What changes when the process changes?</h2><p>The theorem is about a specific arithmetic mechanism. The contrast views are designed to expose that assumption through controlled changes rather than hide it behind a single success badge.</p><Callout variant="strong" title="Reproducible by design"><span>Every seeded contrast and canonical scenario has a deterministic JSON certificate and method label.</span></Callout></> : <><p>Start with the workbench and choose an angle step alpha. The circle shows the orbit points, the arcs expose the gap inventory, and the genealogy records how each new point splits one existing empty arc.</p><h2>A visual atlas, not a toy slider</h2><p>The same state can be read as a Farey cell, a continued-fraction sequence, a return-time word, a lattice window, or a finite 0D Rips filtration. Each lens carries its own theorem boundary and source trail.</p><Equation tex={'\\{n\\alpha\\} \\subset \\mathbb{R}/\\mathbb{Z}'} caption="The finite rotation orbit used by the direct oracle." /></>}</div></main>;
}

function RoutesView({ tab, setTab, labels, scenario, setScenario, certificate, threshold, setThreshold }: { tab: Tab; setTab: (tab: Tab) => void; labels: Record<Tab, string>; scenario: Scenario; setScenario: (scenario: Scenario) => void; certificate: Certificate; threshold: number; setThreshold: (value: number) => void }) {
  const location = useLocation();
  if (location.pathname !== '/') return <ResearchPage path={location.pathname} />;
  const tabs: Array<{ id: Tab; icon: ReactNode }> = [{ id: 'explore', icon: <CircleDot size={15} /> }, { id: 'atlas', icon: <Aperture size={15} /> }, { id: 'return', icon: <Target size={15} /> }, { id: 'topology', icon: <Layers3 size={15} /> }, { id: 'extensions', icon: <Dna size={15} /> }];
  return <main className="app-main"><section className="hero-strip"><div><span className="eyebrow">RESEARCH INSTRUMENT / THREE-GAP DYNAMICS</span><h1>See arithmetic leave a trace.</h1><p>GapTheo turns circle rotations into an explorable atlas of geometry, combinatorics, topology, and proof-aware computation.</p></div><div className="hero-proof"><div className="proof-orbit">{[0, .19, .38, .61, .82].map((value) => <span key={value} style={{ transform: 'rotate(' + value * 360 + 'deg) translateY(-35px)' }} />)}</div><div><StatusBadge certificate={certificate} /><b>At most three lengths</b><small>with c = a + b in the three-gap state</small></div></div></section><nav className="app-tabs" aria-label="Research views">{tabs.map((item) => <button key={item.id} className={tab === item.id ? 'active' : ''} onClick={() => setTab(item.id)}>{item.icon}{labels[item.id]}</button>)}</nav>{tab === 'explore' && <Explore certificate={certificate} scenario={scenario} setScenario={setScenario} />}{tab === 'atlas' && <ProofAtlas certificate={certificate} scenario={scenario} />}{tab === 'return' && <ReturnGaps certificate={certificate} scenario={scenario} />}{tab === 'topology' && <Topology certificate={certificate} threshold={threshold} setThreshold={setThreshold} />}{tab === 'extensions' && <Extensions certificate={certificate} scenario={scenario} />}</main>;
}

export default App;
