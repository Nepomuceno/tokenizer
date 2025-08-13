import type { TokenizerAdapter } from './types'

/**
 * Anthropic tokenizer adapter stub
 * TODO: Implement using Anthropic SDK (count_tokens)
 */
export class AnthropicAdapter implements TokenizerAdapter {
  constructor(_model: string = 'claude-3-haiku-20240307') {
    // TODO: Store model when implementing
  }

  async init(): Promise<void> {
    // TODO: Initialize Anthropic SDK
    throw new Error('Anthropic adapter not yet implemented')
  }

  async encode(_text: string): Promise<number[]> {
    // TODO: Implement token encoding using Anthropic SDK
    throw new Error('Anthropic adapter not yet implemented')
  }

  async count(_text: string): Promise<number> {
    // TODO: Implement token counting using Anthropic SDK count_tokens
    throw new Error('Anthropic adapter not yet implemented')
  }
}
