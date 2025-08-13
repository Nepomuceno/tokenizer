export interface TokenizerAdapter {
  /**
   * Initialize the tokenizer. This should be called once before using encode/count.
   */
  init(): Promise<void>
  
  /**
   * Encode text into token IDs.
   */
  encode(text: string): Promise<number[]>
  
  /**
   * Count tokens in text without returning the actual tokens.
   * This can be more memory efficient for large texts.
   */
  count(text: string): Promise<number>
}

export interface TokenizerSpec {
  type: 'simple' | 'tiktoken' | 'hf-tokenizers' | 'anthropic' | 'gemini' | 'cohere' | 'api-based'
  model?: string
  encoding?: string
  tokenizerPath?: string
  apiEndpoint?: string
}
