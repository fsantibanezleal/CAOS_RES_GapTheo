import { Callout, Equation, Refs, Tabs } from "@fasl-work/caos-app-shell";
import { MethodFigure, PageHead, useT } from "./research/ResearchShared";
import { ScientificFigure } from "./ScientificFigures";
import benchmark from "../data/benchmark.json";

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
