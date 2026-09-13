# Contributing

Please open an issue before substantial changes. Mathematical changes should
include a source citation, a deterministic fixture, and a test that exercises
the relevant boundary.

Frontend changes must preserve:

- the direct sorted-orbit oracle as the authoritative finite calculation;
- explicit labels for theorem assumptions and contrast modes;
- light and dark themes;
- English and Spanish copy;
- the shell lifecycle for animation;
- the no-document-overflow viewport contract.

Run npm run typecheck, npm run test, npm run generate, and
npm run validate before opening a pull request.
