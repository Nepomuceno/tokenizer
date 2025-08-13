import type { TokenizerAdapter } from './types'

/**
 * Cohere tokenizer adapter stub
 * TODO: Implement using Cohere SDK (token counting in API)
 */
export class CohereAdapter implements TokenizerAdapter {
  constructor(_model: string = 'command-r-plus') {
    // TODO: Store model when implementing
  }

  async init(): Promise<void> {
    // TODO: Initialize Cohere SDK
    throw new Error('Cohere adapter not yet implemented')
  }

  async encode(_text: string): Promise<number[]> {
    // TODO: Implement token encoding using Cohere SDK
    throw new Error('Cohere adapter not yet implemented')
  }

  async count(_text: string): Promise<number> {
    // TODO: Implement token counting using Cohere SDK
    throw new Error('Cohere adapter not yet implemented')
  }
}
