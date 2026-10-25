# Static delivery

GapTheo is a client-side research application. GitHub Pages hosts the built frontend and the committed artifacts; there is no API process to start.

Run `cd frontend; npm run dev` for local interactive work. `npm run build` type-checks and builds the static site, materializes every supported nested route, and preserves `frontend/public/CNAME`. The deployment workflow publishes the artifact to GitHub Pages. Test a deep route directly after deployment because a navigation-only check does not establish refresh behavior.
