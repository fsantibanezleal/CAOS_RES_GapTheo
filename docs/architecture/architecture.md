# Architecture

GapTheo separates live interaction, offline reference calculation, committed replay evidence, and static deployment. The separation prevents a release build from silently rewriting scientific results.

## Map

1. [System](01-system.md)
2. [Computation lanes](02-lanes.md)
3. [Deployment](03-deployment.md)

The browser receives no secret and calls no runtime API. A scenario produces one certificate, and every visualization reads that certificate or a clearly labelled comparison result.
