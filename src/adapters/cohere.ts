import type { TokenizerAdapter } from './types'

/**
 * Cohere tokenizer adapter stub
 * TODO: Implement using Cohere SDK (token counting in API)
 */
export class CohereAdapter implements TokenizerAdapter {
  constructor(model: string = 'command-r-plus') { void model }

  async init(): Promise<void> {
    // TODO: Initialize Cohere SDK
    throw new Error('Cohere adapter not yet implemented')
  }

  async encode(text: string): Promise<number[]> {
    void text
    // TODO: Implement token encoding using Cohere SDK
    throw new Error('Cohere adapter not yet implemented')
  }

  async count(text: string): Promise<number> {
    void text
    // TODO: Implement token counting using Cohere SDK
    throw new Error('Cohere adapter not yet implemented')
  }
}
