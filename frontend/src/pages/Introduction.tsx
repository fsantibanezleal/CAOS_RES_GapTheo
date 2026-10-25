import { lazy, Suspense } from "react";
import { DocPage, ExecutiveView, Tabs, useShellLang } from "@fasl-work/caos-app-shell";
import executive from "../../../content/executive.json";

const TechnicalIntroduction = lazy(() => import("./IntroductionPage").then((module) => ({ default: module.IntroductionPage })));

export function Introduction() {
  const es = useShellLang() === "es";
  const t = (en: string, spanish: string) => es ? spanish : en;
  return (
    <DocPage
      title={{ en: "Introduction", es: "Introducción" }}
      lede={t(
        "The finite orbit, circular-gap convention, and irrationality hypothesis are stated first. The research views then compare direct geometry with Farey intervals, continued fractions, dual return times, cyclic gap words, lattice coordinates, and a finite H₀ connectivity filtration.",
        "Primero se definen la órbita finita, la convención de brechas circulares y la hipótesis de irracionalidad. Las vistas comparan luego la geometría directa con intervalos de Farey, fracciones continuas, retornos duales, palabras cíclicas, coordenadas reticulares y una filtración finita de conectividad H₀.",
      )}
    >
      <Tabs
        ariaLabel={t("Introduction views", "Vistas de introducción")}
        tabs={[
          { id: "executive", label: t("Research overview", "Panorama de investigación"), content: <ExecutiveView data={executive} base={import.meta.env.BASE_URL} /> },
          { id: "technical", label: t("Technical introduction", "Introducción técnica"), content: <Suspense fallback={<p className="caos-pending" data-state="loading" role="status" aria-label="Loading / Cargando">…</p>}><TechnicalIntroduction /></Suspense> },
        ]}
      />
    </DocPage>
  );
}
