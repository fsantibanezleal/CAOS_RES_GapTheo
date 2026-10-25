import { Callout, Equation, Refs, SubTabs, Tabs } from "@fasl-work/caos-app-shell";
import { MethodBlock, MethodFigure, PageHead, useT } from "./research/ResearchShared";
import { ScientificFigure } from "./ScientificFigures";

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
