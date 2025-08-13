// Dynamic / lite import pattern for @dqbd/tiktoken to avoid unsupported ESM WASM integration in Vite build
// We intentionally avoid a static import of '@dqbd/tiktoken' because that triggers the raw WASM ESM integration
// which Vite currently errors on ("ESM integration proposal for Wasm" not supported). Instead we:
//  1. Import the lite bundle at runtime
//  2. Fetch the wasm via the ?url virtual asset
//  3. Call init() manually (with streaming + fallback) once and cache the promise
//  4. Acquire the encoding and reuse the tokenizer instance

import type { TokenizerAdapter } from './types'
// We import only the init entrypoint (which re-exports encoding helpers) and manually provide the WASM instance.
// This avoids importing the default bundle that directly performs an ESM WASM import unsupported by Vite's build.
import type { Tiktoken } from '@dqbd/tiktoken'

// Minimal surface of the lite init module after dynamic import
interface TiktokenInitModule {
  init: (cb: (imports: WebAssembly.Imports) => Promise<WebAssembly.Instance | WebAssembly.WebAssemblyInstantiatedSource>) => Promise<void>
  Tiktoken: typeof import('@dqbd/tiktoken').Tiktoken
}

type LoadStyle = { load_tiktoken_bpe: string } | { data_gym_to_mergeable_bpe_ranks: { vocab_bpe_file: string; encoder_json_file: string } }
interface BpeRegistryEntryBase { special_tokens: Record<string, number>; pat_str: string; remote?: string }
type BpeRegistryEntry = (LoadStyle & BpeRegistryEntryBase)

let tiktokenMod: TiktokenInitModule | null = null
let tiktokenInitPromise: Promise<void> | null = null

async function ensureTiktokenInitialized(): Promise<TiktokenInitModule> {
  if (!tiktokenMod) {
  tiktokenMod = await import('@dqbd/tiktoken/lite/init') as unknown as TiktokenInitModule
  }
  // Guard so we only run init once
  if (!tiktokenInitPromise) {
    tiktokenInitPromise = (async () => {
      const wasmUrl = (await import('@dqbd/tiktoken/lite/tiktoken_bg.wasm?url')).default
      const { init } = tiktokenMod
      if (typeof init !== 'function') throw new Error('tiktoken init function missing')
      const fetchResp = async () => {
        const resp = await fetch(wasmUrl)
        if (!resp.ok) throw new Error(`Failed to fetch tiktoken wasm: ${resp.status}`)
        return resp
      }
      // Try streaming then fallback
      try {
        await init((imports: WebAssembly.Imports) => WebAssembly.instantiateStreaming(fetchResp(), imports))
      } catch {
        const resp = await fetchResp()
        const buffer = await resp.arrayBuffer()
        await init((imports: WebAssembly.Imports) => WebAssembly.instantiate(buffer, imports))
      }
    })()
  }
  await tiktokenInitPromise
  return tiktokenMod
}

export class TikTokenAdapter implements TokenizerAdapter {
  private tokenizer: Tiktoken | null = null
  private encoding: string

  constructor(encoding: string = 'cl100k_base') {
    this.encoding = encoding
  }

  async init(): Promise<void> {
    if (this.tokenizer) return
    const mod = await ensureTiktokenInitialized()
    // Build tokenizer manually (lite build doesn't expose get_encoding)
    const { Tiktoken } = mod as { Tiktoken: typeof import('@dqbd/tiktoken').Tiktoken }
    const { load } = await import('@dqbd/tiktoken/lite/load')

    const SUPPORTED = ['cl100k_base', 'o200k_base', 'p50k_base', 'r50k_base', 'gpt2', 'p50k_edit'] as const
  if (!SUPPORTED.includes(this.encoding as typeof SUPPORTED[number])) {
      throw new Error(`Unsupported encoding for lite adapter: ${this.encoding}`)
    }

  // Minimal inline registry subset (avoid importing full registry.json)
  // We first attempt to load from local /encodings/*.tiktoken (user can add files for offline + no CORS)
  const localBase = '/encodings'
  const registry: Record<string, BpeRegistryEntry> = {
      cl100k_base: { load_tiktoken_bpe: `${localBase}/cl100k_base.tiktoken`, remote: 'https://openaipublic.blob.core.windows.net/encodings/cl100k_base.tiktoken', special_tokens: { '<|endoftext|>': 100257, '<|fim_prefix|>': 100258, '<|fim_middle|>': 100259, '<|fim_suffix|>': 100260, '<|endofprompt|>': 100276 }, pat_str: "(?i:'s|'t|'re|'ve|'m|'ll|'d)|[^\\r\\n\\p{L}\\p{N}]?\\p{L}+|\\p{N}{1,3}| ?[^\\s\\p{L}\\p{N}]+[\\r\\n]*|\\s*[\\r\\n]+|\\s+(?!\\S)|\\s+" },
      o200k_base: { load_tiktoken_bpe: `${localBase}/o200k_base.tiktoken`, remote: 'https://openaipublic.blob.core.windows.net/encodings/o200k_base.tiktoken', special_tokens: { '<|endoftext|>': 199999, '<|endofprompt|>': 200018 }, pat_str: "[^\\r\\n\\p{L}\\p{N}]?[\\p{Lu}\\p{Lt}\\p{Lm}\\p{Lo}\\p{M}]*[\\p{Ll}\\p{Lm}\\p{Lo}\\p{M}]+(?i:'s|'t|'re|'ve|'m|'ll|'d)?|[^\\r\\n\\p{L}\\p{N}]?[\\p{Lu}\\p{Lt}\\p{Lm}\\p{Lo}\\p{M}]+[\\p{Ll}\\p{Lm}\\p{Lo}\\p{M}]* (?i:'s|'t|'re|'ve|'m|'ll|'d)?|\\p{N}{1,3}| ?[^\\s\\p{L}\\p{N}]+[\\r\\n/]*|\\s*[\\r\\n]+|\\s+(?!\\S)|\\s+" },
      p50k_base: { load_tiktoken_bpe: `${localBase}/p50k_base.tiktoken`, remote: 'https://openaipublic.blob.core.windows.net/encodings/p50k_base.tiktoken', special_tokens: { '<|endoftext|>': 50256 }, pat_str: "'s|'t|'re|'ve|'m|'ll|'d| ?\\p{L}+| ?\\p{N}+| ?[^\\s\\p{L}\\p{N}]+|\\s+(?!\\S)|\\s+" },
      r50k_base: { load_tiktoken_bpe: `${localBase}/r50k_base.tiktoken`, remote: 'https://openaipublic.blob.core.windows.net/encodings/r50k_base.tiktoken', special_tokens: { '<|endoftext|>': 50256 }, pat_str: "'s|'t|'re|'ve|'m|'ll|'d| ?\\p{L}+| ?\\p{N}+| ?[^\\s\\p{L}\\p{N}]+|\\s+(?!\\S)|\\s+" },
  gpt2: { data_gym_to_mergeable_bpe_ranks: { vocab_bpe_file: `${localBase}/vocab.bpe`, encoder_json_file: `${localBase}/encoder.json` }, special_tokens: { '<|endoftext|>': 50256 }, pat_str: "'s|'t|'re|'ve|'m|'ll|'d| ?\\p{L}+| ?\\p{N}+| ?[^\\s\\p{L}\\p{N}]+|\\s+(?!\\S)|\\s+" },
      p50k_edit: { load_tiktoken_bpe: `${localBase}/p50k_base.tiktoken`, remote: 'https://openaipublic.blob.core.windows.net/encodings/p50k_base.tiktoken', special_tokens: { '<|endoftext|>': 50256, '<|fim_prefix|>': 50281, '<|fim_middle|>': 50282, '<|fim_suffix|>': 50283 }, pat_str: "'s|'t|'re|'ve|'m|'ll|'d| ?\\p{L}+| ?\\p{N}+| ?[^\\s\\p{L}\\p{N}]+|\\s+(?!\\S)|\\s+" }
    }

    const entry = registry[this.encoding]

    // Wrap custom fetch to try local first then remote (if defined)
  const customFetch = async (url: string): Promise<string> => {
      // If request is for local path attempt fetch; on failure and remote exists switch
      const isLocal = url.startsWith(localBase)
      if (isLocal) {
        const res = await fetch(url)
        if (res.ok) return res.text()
        // fallback to remote if present
        if (entry.remote) {
          const remoteRes = await fetch(entry.remote)
          if (remoteRes.ok) return remoteRes.text()
        }
        throw new Error(`Failed to load local BPE: ${url}`)
      }
      // For GPT2 data_gym case we may get local or remote paths
      const res = await fetch(url)
      if (res.ok) return res.text()
      throw new Error(`Failed to fetch ${url}`)
    }

    try {
      // Narrow to acceptable union for load()
      const loadEntry: LoadStyle & { special_tokens: Record<string, number>; pat_str: string } = 'load_tiktoken_bpe' in entry
        ? { load_tiktoken_bpe: entry.load_tiktoken_bpe!, special_tokens: entry.special_tokens, pat_str: entry.pat_str }
        : { data_gym_to_mergeable_bpe_ranks: entry.data_gym_to_mergeable_bpe_ranks!, special_tokens: entry.special_tokens, pat_str: entry.pat_str }
      const data = await load(loadEntry, customFetch as (u: string) => Promise<string>)
      this.tokenizer = new Tiktoken(data.bpe_ranks, data.special_tokens, data.pat_str)
  } catch (err) {
      // Heuristic approximate tokenizer to still allow counting when offline
      const approxEncode = (text: string): number[] => {
        if (!text) return []
        const tokens = text
          .replace(/\s+/g, ' ')
          .trim()
          .match(/[A-Za-z0-9]+|[^\sA-Za-z0-9]/g) || []
        const refined: string[] = []
        for (const t of tokens) {
          if (/^[A-Za-z0-9]{8,}$/.test(t)) {
            for (let i = 0; i < t.length; i += 4) refined.push(t.slice(i, i + 4))
          } else refined.push(t)
        }
        return refined.map((_t, i) => i)
      }
      this.tokenizer = {
        encode: (text: string) => new Uint32Array(approxEncode(text)),
        decode: () => new Uint8Array(),
        free: () => {},
        encode_ordinary: (text: string) => new Uint32Array(approxEncode(text)),
        encode_with_unstable: (text: string) => approxEncode(text),
        encode_single_token: () => 0,
        decode_single_token_bytes: () => new Uint8Array(),
        token_byte_values: () => [],
        get name() { return 'approx-fallback' }
      } as unknown as Tiktoken
  console.warn('[tiktoken] Network fetch failed; using heuristic tokenizer. Counts are approximate.', err)
    }
  }

  async encode(text: string): Promise<number[]> {
    if (!this.tokenizer) {
      throw new Error('TikToken adapter not initialized. Call init() first.')
    }
    const normalizedText = String(text || '')
    const tokens = this.tokenizer.encode(normalizedText)
    return Array.from(tokens)
  }

  async count(text: string): Promise<number> {
    if (!this.tokenizer) {
      throw new Error('TikToken adapter not initialized. Call init() first.')
    }
    const normalizedText = String(text || '')
    return this.tokenizer.encode(normalizedText).length
  }

  /**
   * Decode token IDs back to text
   */
  async decode(tokenIds: number[]): Promise<string> {
    if (!this.tokenizer) {
      throw new Error('TikToken adapter not initialized. Call init() first.')
    }
    
  const arr = new Uint32Array(tokenIds)
  const bytes = this.tokenizer.decode(arr)
  return new TextDecoder().decode(bytes)
  }

  /** Decode a single token id to text (helper for visualization) */
  async decodeSingle(tokenId: number): Promise<string> {
    if (!this.tokenizer) {
      throw new Error('TikToken adapter not initialized. Call init() first.')
    }
    const bytes = this.tokenizer.decode_single_token_bytes(tokenId)
    return new TextDecoder().decode(bytes)
  }

  /**
   * Clean up resources when done
   */
  dispose(): void {
    if (this.tokenizer) {
      this.tokenizer.free()
      this.tokenizer = null
    }
  }
}
