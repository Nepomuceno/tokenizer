import type { TokenizerAdapter } from './types'

interface SimpleBPEVocab {
  [token: string]: number
}

interface SimpleBPEMerges {
  [merge: string]: number
}

/**
 * HuggingFace tokenizers adapter for Llama, Mistral, Qwen, DeepSeek, etc.
 * Uses tokenizer.json files for SentencePiece-based models
 * 
 * Note: This is a simplified implementation that works without native binaries.
 * For production use with full HuggingFace tokenizers, the 'tokenizers' package
 * would need proper native binary support for the target platform.
 */
export class HuggingFaceAdapter implements TokenizerAdapter {
  private vocab: SimpleBPEVocab = {}
  private merges: SimpleBPEMerges = {}
  private tokenizerPath: string
  private initialized = false

  constructor(tokenizerPath: string) {
  // Defer resolution; we'll normalize in init so that Vite's import.meta.env.BASE_URL
  // is available (some tools may construct before environment is injected).
  this.tokenizerPath = tokenizerPath
  }

  async init(): Promise<void> {
    try {
      // Load tokenizer.json file
      interface TokenizerJSON {
        model?: {
          vocab?: SimpleBPEVocab
          merges?: string[]
        }
      }
      let tokenizerData: TokenizerJSON
      
      // Resolve local vs remote path. For local relative/absolute-looking paths we
      // prefix with import.meta.env.BASE_URL (which already contains trailing '/').
      const rawPath = this.tokenizerPath
      const baseUrl = (import.meta as { env?: { BASE_URL?: string } }).env?.BASE_URL || '/'
      const isRemote = /^https?:\/\//i.test(rawPath)
      // Treat paths starting with '/' or without protocol as local assets within public/.
      // Remove any leading '/' so concatenation with BASE_URL (which may itself be './' or '/sub/') works.
      const resolvedPath = isRemote
        ? rawPath
        : `${baseUrl.replace(/\/$/, '')}/${rawPath.replace(/^\//, '')}`

      if (isRemote) {
        // For remote tokenizer.json files
        const response = await fetch(resolvedPath)
        if (!response.ok) {
          throw new Error(`Failed to fetch tokenizer from ${resolvedPath}: ${response.statusText}`)
        }
        tokenizerData = await response.json()
      } else {
        // For local tokenizer.json files (in public directory)
        const response = await fetch(resolvedPath)
        if (!response.ok) {
          throw new Error(`Failed to fetch tokenizer from ${resolvedPath}: ${response.statusText}`)
        }
        tokenizerData = await response.json()
      }

      // Extract vocabulary and merges from tokenizer.json
      if (tokenizerData.model && tokenizerData.model.vocab) {
        this.vocab = tokenizerData.model.vocab
      } else {
        throw new Error('Invalid tokenizer.json format: missing vocab')
      }

      if (tokenizerData.model && tokenizerData.model.merges) {
        // Convert merges array to lookup object
        tokenizerData.model.merges.forEach((merge: string, index: number) => {
          this.merges[merge] = index
        })
      }

      this.initialized = true
    } catch (error) {
  throw new Error(`Failed to initialize HuggingFace tokenizer from ${this.tokenizerPath}: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  async encode(text: string): Promise<number[]> {
    if (!this.initialized) {
      throw new Error('HuggingFace tokenizer not initialized. Call init() first.')
    }

    // The lightweight adapter currently only loads vocab metadata but does not
    // perform true BPE/SentencePiece operations. Rather than returning an
    // inaccurate approximation, we report unsupported so the UI can disable
    // selection or inform the user.
    throw new Error('HuggingFace tokenizer encode not supported in lite mode')
  }

  async count(text: string): Promise<number> {
    if (!this.initialized) {
      throw new Error('HuggingFace tokenizer not initialized. Call init() first.')
    }
    throw new Error('HuggingFace tokenizer count not supported in lite mode')
  }

  // Intentionally no fallback simpleEncode implementation to avoid misleading counts
}
