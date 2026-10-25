# Guide: the research overview

The Introduction opens with the shell's executive-view component, as required by the product shell ADR. GapTheo uses that
fixed structure to state the mathematical problem, its literature context, and the scope of the finite atlas. The content
is authored in `content/executive.json`; diagrams are in `frontend/public/executive/`.

## Content rules used here

- State the infinite theorem separately from finite numerical checks. A decimal does not establish irrationality.
- Keep the shared input convention visible: `x_n = {φ + nα}`, `0 ≤ n < N`, cyclic order, and the final-to-first gap.
- Describe geometric, Farey, continued-fraction, symbolic, return-time, and finite-topology views with their own limits.
- Link every mathematical claim to a cited source. The literature review records which scope claims have not been checked
  line by line.
- Keep the overview analytical. Do not add audience pain estimates, impact metrics, or percentages that the evidence does
  not measure.

The shell schema requires a weighted distribution in the problem section. GapTheo labels those values as the exact share
of the twelve scenarios in the committed catalog: five rotation examples, three phase/size/conditioning examples, and
four rational-boundary or allocation controls. They describe repository coverage only, not prevalence or importance.

## Review and validation

`frontend/src/content/executive.test.ts` validates the bilingual text, citations, figure assets, and shell schema.
`npm run ci` includes the frontend tests and the shell's measured route gate. Edit the single JSON source and the referenced
illustration assets, then review both languages in the browser at desktop and phone widths.
