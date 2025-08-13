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
    this.tokenizerPath = tokenizerPath
  }

  async init(): Promise<void> {
    try {
      // Load tokenizer.json file
      let tokenizerData: any
      
      if (this.tokenizerPath.startsWith('http')) {
        // For remote tokenizer.json files
        const response = await fetch(this.tokenizerPath)
        if (!response.ok) {
          throw new Error(`Failed to fetch tokenizer from ${this.tokenizerPath}: ${response.statusText}`)
        }
        tokenizerData = await response.json()
      } else {
        // For local tokenizer.json files (in public directory)
        const response = await fetch(this.tokenizerPath)
        if (!response.ok) {
          throw new Error(`Failed to fetch tokenizer from ${this.tokenizerPath}: ${response.statusText}`)
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

    try {
      return this.simpleEncode(text)
    } catch (error) {
      throw new Error(`Failed to encode text with HuggingFace tokenizer: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  async count(text: string): Promise<number> {
    if (!this.initialized) {
      throw new Error('HuggingFace tokenizer not initialized. Call init() first.')
    }

    try {
      const tokens = this.simpleEncode(text)
      return tokens.length
    } catch (error) {
      throw new Error(`Failed to count tokens with HuggingFace tokenizer: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  private simpleEncode(text: string): number[] {
    if (!text) return []

    // Simple tokenization approach:
    // 1. Split into words and handle subwords
    // 2. Look up tokens in vocabulary
    // 3. Fall back to character-level tokenization for unknown tokens

    const tokens: number[] = []
    const words = text.split(/(\s+)/)

    for (const word of words) {
      if (word.trim() === '') {
        // Handle whitespace
        const spaceToken = this.vocab['▁'] || this.vocab[' ']
        if (spaceToken !== undefined) {
          tokens.push(spaceToken)
        }
        continue
      }

      // Try to find the word in vocabulary (with and without space prefix)
      const wordWithSpace = '▁' + word
      if (this.vocab[wordWithSpace] !== undefined) {
        tokens.push(this.vocab[wordWithSpace])
        continue
      }

      if (this.vocab[word] !== undefined) {
        tokens.push(this.vocab[word])
        continue
      }

      // Fall back to character-level tokenization
      for (const char of word) {
        if (this.vocab[char] !== undefined) {
          tokens.push(this.vocab[char])
        } else {
          // Use a default unknown token ID or the first token
          const unknownTokenId = this.vocab['<unk>'] || this.vocab['[UNK]'] || 0
          tokens.push(unknownTokenId)
        }
      }
    }

    return tokens
  }
}
