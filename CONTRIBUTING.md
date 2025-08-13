# Contributing Guide

Thank you for your interest in contributing! 🧡

## Quick Start

```bash
bun install
bun run dev
```

Run tests & lint:

```bash
bun run test
bun run lint
```

## Project Principles
- 100% client-side; no backend code.
- Keep components lean; heavy logic in `src/lib` or workers.
- Tokenizers & heavy assets are lazy-loaded.
- Strong typing; avoid `any`.

## Architecture Highlights
- Model registry: `src/modelRegistry.ts`
- Tokenizer adapters: `src/adapters/*`
- Parsing: `src/parsers` (future) or inline minimal logic
- Worker: `src/workers/tokenize.worker.ts`

## Adding a Model
1. Add tokenizer JSON (if HF) into `public/tokenizers/`.
2. Register model in `modelRegistry.ts`.
3. Write / adjust adapter tests.
4. Verify counts locally (`bun run dev`).

## Commit Messages
Use conventional style where possible:
- `feat: add qwen tokenizer`
- `fix: prevent worker freeze on large pdf`
- `docs: update README badges`

## Pull Requests
- Keep diffs focused.
- Include tests for new parsing/tokenizing logic.
- Update README if feature is user-visible.
- Ensure `bun run lint` and `bun run test` pass.

## Testing
Vitest is configured. Put tests in `src/test/` following existing patterns.

## Release & Deployment
Merges to `main` trigger CI and GitHub Pages deploy.

## Security
See `SECURITY.md` for vulnerability reporting.

## Questions / Ideas
Open a discussion or draft PR. Friendly maintainers will help. 😄

Happy hacking!
