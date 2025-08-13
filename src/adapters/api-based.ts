import type { TokenizerAdapter } from './types'

/**
 * API-based tokenizer adapter stub for models without public tokenizers
 * TODO: Implement for xAI Grok, Perplexity models, etc.
 * These require API calls to get token counts
 */
export class ApiBasedAdapter implements TokenizerAdapter {
  constructor(_model: string, _apiEndpoint?: string) {
    // TODO: Store model and apiEndpoint when implementing
  }

  async init(): Promise<void> {
    // TODO: Validate API access and credentials
    throw new Error('API-based adapter not yet implemented')
  }

  async encode(_text: string): Promise<number[]> {
    // TODO: Many API-based models don't expose token IDs
    // May need to return estimated tokens or throw not supported
    throw new Error('API-based adapter not yet implemented')
  }

  async count(_text: string): Promise<number> {
    // TODO: Make API call to count tokens
    // Different APIs have different endpoints for this
    throw new Error('API-based adapter not yet implemented')
  }
}
