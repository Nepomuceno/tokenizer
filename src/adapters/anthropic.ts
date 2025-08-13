import type { TokenizerAdapter } from './types'

/**
 * Anthropic tokenizer adapter stub
 * TODO: Implement using Anthropic SDK (count_tokens)
 */
export class AnthropicAdapter implements TokenizerAdapter {
  constructor(model: string = 'claude-3-haiku-20240307') {
    // intentionally unused until implementation
    void model
  }

  async init(): Promise<void> {
    // TODO: Initialize Anthropic SDK
    throw new Error('Anthropic adapter not yet implemented')
  }

  async encode(text: string): Promise<number[]> {
    void text // suppress unused until implemented
    // TODO: Implement token encoding using Anthropic SDK
    throw new Error('Anthropic adapter not yet implemented')
  }

  async count(text: string): Promise<number> {
    void text // suppress unused until implemented
    // TODO: Implement token counting using Anthropic SDK count_tokens
    throw new Error('Anthropic adapter not yet implemented')
  }
}
