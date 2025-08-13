# Local Tiktoken BPE Files

Place the following files here for fully offline & CORS‑safe usage:

Required encodings:

* `cl100k_base.tiktoken`
* `o200k_base.tiktoken`
* `p50k_base.tiktoken`
* `r50k_base.tiktoken`

Optional:

* `p50k_edit` reuses `p50k_base.tiktoken`
* `gpt2` requires `vocab.bpe` + `encoder.json` (not included by default)

Download sources (OpenAI public blobs):

* [cl100k_base.tiktoken](https://openaipublic.blob.core.windows.net/encodings/cl100k_base.tiktoken)
* [o200k_base.tiktoken](https://openaipublic.blob.core.windows.net/encodings/o200k_base.tiktoken)
* [p50k_base.tiktoken](https://openaipublic.blob.core.windows.net/encodings/p50k_base.tiktoken)
* [r50k_base.tiktoken](https://openaipublic.blob.core.windows.net/encodings/r50k_base.tiktoken)
* GPT‑2: [vocab.bpe](https://openaipublic.blob.core.windows.net/gpt-2/encodings/main/vocab.bpe) and [encoder.json](https://openaipublic.blob.core.windows.net/gpt-2/encodings/main/encoder.json)

The app attempts local `/encodings/` first, then remote. If both fail, it falls back to an approximate heuristic tokenizer (counts may differ slightly from real tiktoken).
