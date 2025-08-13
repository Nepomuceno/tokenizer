import type { TokenizerAdapter, TokenizerSpec } from '../adapters/types'
import { SimpleTokenizerAdapter } from '../adapters/simple'
import { TikTokenAdapter } from '../adapters/tiktoken'
import { HuggingFaceAdapter } from '../adapters/huggingface'
import { AnthropicAdapter } from '../adapters/anthropic'
import { GeminiAdapter } from '../adapters/gemini'
import { CohereAdapter } from '../adapters/cohere'
import { ApiBasedAdapter } from '../adapters/api-based'

/**
 * Factory for creating and caching tokenizer adapters.
 * Ensures each tokenizer is initialized only once.
 */
class TokenizerFactory {
  private adapters = new Map<string, TokenizerAdapter>()

  async getAdapter(spec: TokenizerSpec): Promise<TokenizerAdapter> {
    const key = this.getSpecKey(spec)
    
    let adapter = this.adapters.get(key)
    if (!adapter) {
      adapter = await this.createAdapter(spec)
      await adapter.init()
      this.adapters.set(key, adapter)
    }
    
    return adapter
  }

  private async createAdapter(spec: TokenizerSpec): Promise<TokenizerAdapter> {
    switch (spec.type) {
      case 'simple':
        return new SimpleTokenizerAdapter()
      
      case 'tiktoken':
        return new TikTokenAdapter(spec.encoding || 'cl100k_base')
      
      case 'hf-tokenizers':
        if (!spec.tokenizerPath) {
          throw new Error('HuggingFace tokenizer requires tokenizerPath')
        }
        return new HuggingFaceAdapter(spec.tokenizerPath)
      
      case 'anthropic':
        return new AnthropicAdapter(spec.model)
      
      case 'gemini':
        return new GeminiAdapter(spec.model)
      
      case 'cohere':
        return new CohereAdapter(spec.model)
      
      case 'api-based':
        return new ApiBasedAdapter(spec.model || 'unknown', spec.apiEndpoint)
      
      default:
        throw new Error(`Unknown tokenizer type: ${spec.type}`)
    }
  }

  private getSpecKey(spec: TokenizerSpec): string {
    return JSON.stringify(spec)
  }

  /**
   * Clear all cached adapters. Useful for testing or memory management.
   */
  clear(): void {
    this.adapters.clear()
  }
}

export const tokenizerFactory = new TokenizerFactory()
