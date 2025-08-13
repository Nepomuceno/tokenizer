---
applyTo: "**"
---
# General Implementation Guidance

- Keep components small; move heavy logic to `src/lib` or workers.
- Always type return values and public interfaces; no `any`.
- Prefer `import()` for WASM/tokenizer loading to keep initial bundle small.
- For PDFs, extract text page-by-page to avoid memory spikes.
- For workers, use `postMessage` with transferable `ArrayBuffer` where applicable.
- Add minimal Vitest tests when adding new parser or tokenizer adapter.