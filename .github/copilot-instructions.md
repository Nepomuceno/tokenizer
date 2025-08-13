# Copilot Repository Instructions — Token Counter

NO NEED to EVER run the project I have it always running in the background and will alert you in anything it is running as an error only do type checks and builds to verify things.

If you need to use a library or add things to a library always check its implementation on context7 before.

DO not add packages by changing the packages.json file directly. always use the `bun add` command.

Never create test files in the root always create vitest if you want to test something and if you are crating tests do no do tests that will be deleted. and never delete tests make them work do not remove test files. 

## Project purpose
A 100% client-side token counter web app (Vite + React + TypeScript) that counts tokens across model families and common file types (PDF/MD/TXT/DOCX/CSV). Deployed on GitHub Pages.

## Tech stack & rules
- Framework: React + TypeScript + Vite. Use functional components & hooks.
- Styling: Tailwind; utility-first; no external CSS frameworks unless necessary.
- State: Lightweight; prefer local state or Zustand for simple global needs.
- Build: Bun as package manager (`bun install`, `bun dev`, `bun run build`).
- Performance: Heavy tokenization runs in a Web Worker; keep main thread snappy.
- WASM: Lazy-load tokenizers; cache instances; avoid blocking imports.
- File parsing:
  - PDF: `pdfjs-dist` → plain text
  - Markdown: `remark` + `remark-parse` → plain text (strip code fences/front-matter)
  - DOCX: `mammoth` (browser build)
  - TXT/CSV: native `FileReader`
- Tokenizers:
  - GPT models: `@dqbd/tiktoken` (e.g., `cl100k_base`, `o200k_base`)
  - Llama/Mistral/Qwen: `tokenizers` with `tokenizer.json`
- UX:
  - Drag-and-drop files, paste box, per-file counts, totals, context-window badge.
  - Optional cost estimator (user-editable price per 1K tokens).
  - Show warning if extraction from PDF is lossy; allow manual paste fallback.

## Folder baseline
- `src/adapters/` tokenizer adapters (`tiktoken.ts`, `hf-tokenizers.ts`)
- `src/parsers/` file parsers (`pdf.ts`, `markdown.ts`, `docx.ts`, `text.ts`)
- `src/workers/` `tokenize.worker.ts` (receives text + model key → returns counts)
- `src/modelRegistry.ts` map model → tokenizer spec, ctx window, optional pricing
- `public/tokenizers/` ship a few `tokenizer.json` (llama, mistral)

## Code generation conventions
- Prefer pure functions for counting; keep UI thin.
- Provide type-safe boundaries (e.g., `TokenizerAdapter` interface).
- No hard-coding of price or ctx values; use `modelRegistry`.
- Large text: chunk intelligently before tokenization (100–500 KiB slices).
- Do not bundle unused WASM/tokenizers; lazy import by model selection.

## Definitions the agent can rely on
- “Tokenizer adapter”: an object with `init()`, `encode(text): Promise<number[]>`, `count(text): Promise<number>`; adapters are cached singletons.
- “Model key”: registry key like `gpt-4o-mini`, `llama-3-8b`, `mistral-nemo`.

## Done means
- Works offline, counts accurately for selected model(s), UI never blocks, and build is deployable to GitHub Pages (`base: './'`).