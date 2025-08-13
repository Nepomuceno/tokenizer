import type { TokenizerAdapter } from './types'

/**
 * API-based tokenizer adapter stub for models without public tokenizers
 * TODO: Implement for xAI Grok, Perplexity models, etc.
 * These require API calls to get token counts
 */
export class ApiBasedAdapter implements TokenizerAdapter {
  constructor(model: string, apiEndpoint?: string) {
    void model; void apiEndpoint
  }

  async init(): Promise<void> {
    // TODO: Validate API access and credentials
    throw new Error('API-based adapter not yet implemented')
  }

  async encode(text: string): Promise<number[]> {
    void text
    // TODO: Many API-based models don't expose token IDs
    // May need to return estimated tokens or throw not supported
    throw new Error('API-based adapter not yet implemented')
  }

  async count(text: string): Promise<number> {
    void text
    // TODO: Make API call to count tokens
    // Different APIs have different endpoints for this
    throw new Error('API-based adapter not yet implemented')
  }
}
