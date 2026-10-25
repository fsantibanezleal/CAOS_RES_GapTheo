# GapTheo research documentation

The documentation records the mathematical contract, reviewed literature, architecture, experimental protocol, and
limits of the finite computations. The interactive app is a research instrument for studying examples of the
three-gap theorem; it does not claim a new theorem or proof.

## Research basis

- [Deep literature review](research/deep-review.md): theorem history, proof approaches, related structures, and open
  questions, with linked sources.
- [Mathematical contract](research/mathematical-contract.md): definitions, hypotheses, circular conventions, and
  exact versus numerical claims.
- [Reproducibility record](research/reproducibility.md): canonical inputs, certificate fields, validation, and replay.
- [Manuscript source](../manuscripts/gaptheo/tex/main.tex): the research note developed from this review.

## Implementation

- [Architecture overview](architecture/01_overview.md) and the remaining architecture notes describe computation
  lanes, browser calculations, artifacts, and deployment.
- [Design and requirements](design/SDD.md) maps product requirements to implementation and gates.
- [Guides](guides.md) document the canonical bake, deployment, and research workflows.

Results are drawn from the committed GapTheo artifacts. A finite numerical agreement is evidence about an example and
the implementation; it does not establish irrationality or prove the infinite theorem.
