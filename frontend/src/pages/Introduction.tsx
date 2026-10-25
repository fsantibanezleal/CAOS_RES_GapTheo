import { DocPage, ExecutiveView, Tabs, useShellLang } from "@fasl-work/caos-app-shell";
import executive from "../../../content/executive.json";
import { IntroductionPage as TechnicalIntroduction } from "./ResearchPages";

export function Introduction() {
  const es = useShellLang() === "es";
  const t = (en: string, spanish: string) => es ? spanish : en;
  return (
    <DocPage
      title={{ en: "Introduction", es: "Introducción" }}
      lede={t(
        "We define the finite rotation orbit and its hypotheses, specify the circular partition and gap conventions, distinguish theorem guarantees from computed evidence, and connect geometric gaps to the arithmetic structures that organize exact changes across reproducible examples.",
        "Definiciones, hipótesis, construcción de la órbita finita, convenciones de partición circular, descripciones aritméticas y frontera entre afirmaciones exactas del teorema y evidencia numérica reproducible para estudiar y verificar las tres distancias en ejemplos interactivos y reproducibles.",
      )}
    >
      <Tabs
        ariaLabel={t("Introduction views", "Vistas de introducción")}
        tabs={[
          { id: "executive", label: t("Research overview", "Panorama de investigación"), content: <ExecutiveView data={executive} base={import.meta.env.BASE_URL} /> },
          { id: "technical", label: t("Technical introduction", "Introducción técnica"), content: <TechnicalIntroduction /> },
        ]}
      />
    </DocPage>
  );
}
