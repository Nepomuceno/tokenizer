import { Tiktoken, get_encoding } from '@dqbd/tiktoken'
import type { TokenizerAdapter } from './types'

export class TikTokenAdapter implements TokenizerAdapter {
  private tokenizer: Tiktoken | null = null
  private encoding: string

  constructor(encoding: string = 'cl100k_base') {
    this.encoding = encoding
  }

  async init(): Promise<void> {
    if (!this.tokenizer) {
      // get_encoding already has proper typings for known encodings
      this.tokenizer = get_encoding(this.encoding as unknown as never)
    }
  }

  async encode(text: string): Promise<number[]> {
    if (!this.tokenizer) {
      throw new Error('TikToken adapter not initialized. Call init() first.')
    }
    
    // Ensure we have a string and handle edge cases
    const normalizedText = String(text || '')
    const tokens = this.tokenizer.encode(normalizedText)
    return Array.from(tokens)
  }

  async count(text: string): Promise<number> {
    if (!this.tokenizer) {
      throw new Error('TikToken adapter not initialized. Call init() first.')
    }
    
    // Ensure we have a string and handle edge cases
    const normalizedText = String(text || '')
    
    // Use encode to get the token array and return its length
    // This ensures consistency between encode() and count()
    const tokens = this.tokenizer.encode(normalizedText)
    return tokens.length
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
