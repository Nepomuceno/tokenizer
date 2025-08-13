import type { TokenizerAdapter } from './types'

/**
 * Simple tokenizer that splits on whitespace and basic punctuation.
 * This is a fallback tokenizer for when more sophisticated ones aren't available.
 */
export class SimpleTokenizerAdapter implements TokenizerAdapter {
  private initialized = false

  async init(): Promise<void> {
    // Simple tokenizer needs no initialization
    this.initialized = true
  }

  async encode(text: string): Promise<number[]> {
    if (!this.initialized) {
      throw new Error('SimpleTokenizerAdapter not initialized. Call init() first.')
    }

    const tokens = this.tokenize(text)
    // Return simple hash-based token IDs for consistency
    return tokens.map(token => this.hashString(token))
  }

  async count(text: string): Promise<number> {
    if (!this.initialized) {
      throw new Error('SimpleTokenizerAdapter not initialized. Call init() first.')
    }

    return this.tokenize(text).length
  }

  /**
   * Get the raw token strings (exposed for UI purposes)
   */
  tokenize(text: string): string[] {
    if (!text) {
      return []
    }

    // Simple character-by-character tokenization - no space treatment
    // Just split into reasonable chunks without removing anything
    const tokens: string[] = []
    let currentToken = ''
    
    for (let i = 0; i < text.length; i++) {
      const char = text[i]
      
      // If it's punctuation, treat it as a separate token
      if (/[.,!?;:()[\]{}"'`~@#$%^&*+=|\\/<>]/.test(char)) {
        if (currentToken) {
          tokens.push(currentToken)
          currentToken = ''
        }
        tokens.push(char)
      }
      // If it's whitespace, end current token but preserve the space
      else if (/\s/.test(char)) {
        if (currentToken) {
          tokens.push(currentToken)
          currentToken = ''
        }
        tokens.push(char)
      }
      // Otherwise, add to current token
      else {
        currentToken += char
      }
    }
    
    // Add remaining token
    if (currentToken) {
      tokens.push(currentToken)
    }
    
    return tokens
  }

  private hashString(str: string): number {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return Math.abs(hash)
  }
}
