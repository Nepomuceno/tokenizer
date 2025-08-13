import { describe, it, expect, beforeAll, vi } from 'vitest'
import { tokenizerFactory } from '../lib/tokenizerFactory'
import { getModelInfo } from '../modelRegistry'

// Mock fetch for testing
const mockTokenizerData = {
  "version": "1.0",
  "model": {
    "type": "BPE",
    "vocab": {
      "Hello": 200,
      "world": 201,
      "!": 0,
      " ": 94,
      "▁": 94,
      "▁Hello": 300,
      "▁world": 301
    },
    "merges": []
  }
}

describe('HuggingFace Integration', () => {
  beforeAll(() => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockTokenizerData)
    } as Response)
  })

  it('should work with the Mistral model from registry', async () => {
    const modelInfo = getModelInfo('mistral-7b')
    expect(modelInfo).toBeDefined()
    expect(modelInfo?.tokenizerSpec.type).toBe('hf-tokenizers')

    if (modelInfo) {
      const adapter = await tokenizerFactory.getAdapter(modelInfo.tokenizerSpec)
      expect(adapter).toBeDefined()

      const text = 'Hello world!'
      const tokenIds = await adapter.encode(text)
      const count = await adapter.count(text)

      expect(tokenIds).toBeInstanceOf(Array)
      expect(tokenIds.length).toBeGreaterThan(0)
      expect(count).toBe(tokenIds.length)
    }
  })

  it('should handle factory caching correctly', async () => {
    const modelInfo = getModelInfo('mistral-7b')
    if (modelInfo) {
      const adapter1 = await tokenizerFactory.getAdapter(modelInfo.tokenizerSpec)
      const adapter2 = await tokenizerFactory.getAdapter(modelInfo.tokenizerSpec)
      
      // Should return the same instance due to caching
      expect(adapter1).toBe(adapter2)
    }
  })
})
