# Deployment

GitHub Pages is the only deployment target. The workflow builds the static client from the reviewed commit and publishes
it after CI succeeds on `main`. The live check verifies the build identity, all routes, and a missing-file response.
There is no server service, reverse proxy, or environment secret in this product.

See [Pages deployment](pages.md) for repository and custom-domain setup.
