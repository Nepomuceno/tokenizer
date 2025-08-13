import type { TokenizerAdapter } from './types'

/**
 * Google Gemini tokenizer adapter stub
 * TODO: Implement using google-generativeai SDK (count_tokens)
 */
export class GeminiAdapter implements TokenizerAdapter {
  constructor(model: string = 'gemini-2.5-flash') { void model }

  async init(): Promise<void> {
    // TODO: Initialize Google Generative AI SDK
    throw new Error('Gemini adapter not yet implemented')
  }

  async encode(text: string): Promise<number[]> {
    void text
    // TODO: Implement token encoding using Google Generative AI SDK
    throw new Error('Gemini adapter not yet implemented')
  }

  async count(text: string): Promise<number> {
    void text
    // TODO: Implement token counting using Google Generative AI SDK count_tokens
    throw new Error('Gemini adapter not yet implemented')
  }
}
