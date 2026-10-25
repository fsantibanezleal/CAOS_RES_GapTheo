import { Callout, Equation, Refs, Tabs, useShellLang } from "@fasl-work/caos-app-shell";
import { MethodFigure, PageHead, useT } from "./research/ResearchShared";
import { ScientificFigure } from "./ScientificFigures";
import benchmark from "../data/benchmark.json";
const CATEGORY_ES: Record<string, string> = {
  "Irrational rotations": "Rotaciones irracionales",
  "Transcendental rotations": "Rotaciones trascendentes",
  "Phase and finite size": "Fase y tamaño finito",
  "Numerical conditioning": "Condicionamiento numérico",
  "Rational boundaries": "Fronteras racionales",
  "Process contrasts": "Contrastes de proceso",
};

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
              <strong>{new Intl.NumberFormat(es ? "es-ES" : "en-US", { notation: "scientific", maximumSignificantDigits: 3, useGrouping: false }).format(maxResidual)}</strong>
            </div>
            <div className="metric">
              <span>
                {t({
                  en: "maximum partition residual",
                  es: "residuo de partición máximo",
                })}
              </span>
              <strong>{new Intl.NumberFormat(es ? "es-ES" : "en-US", { notation: "scientific", maximumSignificantDigits: 3, useGrouping: false }).format(maxPartition)}</strong>
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
