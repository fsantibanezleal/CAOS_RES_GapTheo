# Computational dependencies

The canonical reference pipeline uses Python's standard library. The browser application uses React, the shared CAOS
app shell, KaTeX for displayed mathematics, and small chart/interaction libraries for the live workbench. Dependency
versions are pinned in `frontend/package.json` and `frontend/package-lock.json`.

The mathematical methods are implemented as transparent deterministic routines in the project and documented in the
methodology and implementation routes. No learned model, GPU runtime, or external data provider is required to build
or deploy the static site. The related mathematical literature is listed in
[`research/deep-review.md`](research/deep-review.md).
