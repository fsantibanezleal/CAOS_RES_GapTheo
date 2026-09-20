import type { ArchitectureConfig } from "@fasl-work/caos-app-shell";

export const architecture: ArchitectureConfig = {
  tabs: [
    {
      id: "app",
      en: "The app",
      es: "La app",
      svg: "svg/tech/01-the-app.svg",
      body_en:
        "GapTheo is a mathematical research workbench for finite circle rotations. A selected canonical case or a live parameter change produces one shared certificate that drives the orbit, the gap inventory, the Farey cell, the return-time sequence, the word, the lattice view, and the topology filtration. The status badge is derived from the declared regime and the direct sorted-orbit computation.\n\nThe app is not a formal proof assistant and does not infer irrationality from a decimal. Rational, near-rational, random, farthest-point, and two-frequency experiments are visibly separated from the classical theorem regime.",
      body_es:
        "GapTheo es un laboratorio de investigación matemática para rotaciones finitas del círculo. Un caso canónico seleccionado o un cambio de parámetros produce un certificado compartido que alimenta la órbita, el inventario de brechas, la celda de Farey, la secuencia de retornos, la palabra, la vista de retículo y la filtración topológica. El estado se deriva del régimen declarado y del cálculo directo de la órbita ordenada.\n\nLa app no es un asistente de prueba formal ni infiere irracionalidad desde un decimal. Los experimentos racionales, casi racionales, aleatorios, de punto más lejano y de dos frecuencias están separados del régimen del teorema clásico.",
    },
    {
      id: "lanes",
      en: "Lanes",
      es: "Carriles",
      svg: "svg/tech/02-lanes.svg",
      body_en:
        "The live lane is TypeScript in the browser and recomputes bounded experiments without a server. The offline lane is the Python reference pipeline with named ingest, preprocess, partition, feature, registry, inference, evaluation, export, and validation stages. The replay lane serves the committed, checksummed canonical certificates and benchmark matrix.\n\nDeployment validates committed evidence and builds the browser bundle. It does not rewrite the canonical scientific artifacts. A sandboxed pipeline smoke run proves that fresh outputs can be reproduced without mutating release evidence.",
      body_es:
        "El carril en vivo usa TypeScript en el navegador y recalcula experimentos acotados sin servidor. El carril offline es el pipeline de referencia en Python con etapas nombradas de ingesta, preproceso, partición, características, registro, inferencia, evaluación, exportación y validación. El carril de reproducción sirve certificados canónicos y la matriz de benchmark con hashes.\n\nEl despliegue valida la evidencia versionada y construye el navegador. No reescribe los artefactos científicos canónicos. Una prueba del pipeline en un directorio aislado demuestra la reproducción sin mutar la evidencia de release.",
    },
    {
      id: "web",
      en: "Web flow",
      es: "Flujo web",
      svg: "svg/tech/03-web-flow.svg",
      body_en:
        "The case selector loads one of twelve canonical parameter vectors. Continuous controls can then diverge from that preset. A single computeCertificate call produces stable point and gap identifiers plus the derived Farey, continued-fraction, return, topology, word, lattice, discrepancy, and extension views.\n\nThe shared CAOS shell owns the six-route navigation, language, theme, architecture dialog, and footer. The App route owns the viewport and scrolls only inside its instrument surface. Documentation routes use the centered reading container.",
      body_es:
        "El selector carga uno de doce vectores canónicos de parámetros. Los controles continuos pueden divergir de ese preset. Una llamada única a computeCertificate produce identificadores estables de puntos y brechas junto con las vistas de Farey, fracciones continuas, retornos, topología, palabra, retículo, discrepancia y extensiones.\n\nEl shell compartido de CAOS controla las seis rutas, idioma, tema, diálogo de arquitectura y pie. La ruta App ocupa el viewport y desplaza solo dentro del instrumento. Las rutas documentales usan el contenedor de lectura centrado.",
    },
    {
      id: "science",
      en: "The science",
      es: "La ciencia",
      svg: "svg/tech/04-science.svg",
      body_en:
        "For a rotation x_n = {phase + n alpha}, the direct oracle sorts the finite orbit and closes the circle with a wrap gap. Numerical grouping uses a documented tolerance. The classical certificate checks at most three lengths and the additive relation when three occur. Farey neighbors and continued-fraction convergents explain the event structure as alpha and N change.\n\nReturn times answer a dual question for visits to [0,beta). The zero-dimensional Rips lens records component merges at observed gap thresholds. Word, lattice, and interval-exchange views are explanatory readings of the same state. Contrast processes remain outside the theorem badge.",
      body_es:
        "Para una rotación x_n = {fase + n alfa}, el oráculo directo ordena la órbita finita y cierra el círculo con la brecha envolvente. La agrupación numérica usa una tolerancia documentada. El certificado clásico verifica como máximo tres longitudes y la relación aditiva cuando aparecen tres. Los vecinos de Farey y convergentes explican los eventos al cambiar alfa y N.\n\nLos tiempos de retorno responden una pregunta dual para visitas a [0,beta). La lente de Rips en dimensión cero registra fusiones de componentes en los umbrales observados. Las vistas de palabra, retículo e intercambio son lecturas explicativas del mismo estado. Los contrastes quedan fuera del distintivo del teorema.",
    },
    {
      id: "contracts",
      en: "Contracts and evidence",
      es: "Contratos y evidencia",
      svg: "svg/tech/05-contracts.svg",
      body_en:
        "Contract 1 defines a scenario: identity, mathematical category, angle declaration, rational numerator and denominator, point count, phase, target interval, allocator, and seed. Contract 2 defines a certificate: method version, points, gaps, grouped lengths, theorem status, residuals, discrepancy, source trail, and content hash.\n\nThe canonical matrix spans irrational rotations, phase and finite-size changes, numerical conditioning, rational boundaries, and process contrasts. Every release validates all cells, the unit-circle partition sum, the theorem boundary, the dual bound, and every SHA-256 content hash.",
      body_es:
        "El contrato 1 define un escenario: identidad, categoría matemática, declaración del ángulo, numerador y denominador racional, cantidad de puntos, fase, intervalo objetivo, asignador y semilla. El contrato 2 define un certificado: versión del método, puntos, brechas, longitudes agrupadas, estado, residuos, discrepancia, fuentes y hash.\n\nLa matriz canónica cubre rotaciones irracionales, cambios de fase y tamaño, condicionamiento numérico, fronteras racionales y contrastes de proceso. Cada release valida todas las celdas, la suma de la partición circular, la frontera del teorema, el límite dual y cada hash SHA-256.",
    },
  ],
};
