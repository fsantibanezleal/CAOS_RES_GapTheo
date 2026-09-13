# GitHub Pages deployment

The site is deployed from main by .github/workflows/deploy-pages.yml. The
workflow generates and validates analytic artifacts, installs the frontend
with the lockfile, builds frontend/dist, and publishes it through the Pages
artifact and deployment actions.

The custom domain is stored in frontend/public/CNAME:

    gaptheo.fasl-work.com

The file travels with the Pages artifact. GitHub Pages also requires the
repository Pages custom-domain setting, which is configured separately with
the Pages API and checked in the release evidence. DNS, HTTPS, Pages workflow,
and rendered browser behavior are separate gates.

## Production verification

Record the following for each release:

- Git commit and release tag
- workflow run and conclusion
- Pages API response and CNAME
- DNS lookup result
- HTTPS certificate state
- root and direct-route requests
- desktop and phone screenshots
