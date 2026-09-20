# Deployment

GitHub Pages serves the static Vite bundle at the custom domain. CI reproduces the reference pipeline inside a temporary directory and validates committed artifacts. Deployment validates those artifacts but does not regenerate them.

The release gate requires Python tests, browser-engine tests, type checking, production build, zero dependency audit findings, direct-route checks, and rendered production inspection in both themes and languages.
