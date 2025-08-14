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

  it('should provide adapter for Mistral model but encode/count unsupported', async () => {
    const modelInfo = getModelInfo('mistral-7b')
    expect(modelInfo).toBeDefined()
    expect(modelInfo?.tokenizerSpec.type).toBe('hf-tokenizers')

    if (modelInfo) {
      const adapter = await tokenizerFactory.getAdapter(modelInfo.tokenizerSpec)
      expect(adapter).toBeDefined()
      await expect(adapter.encode('Hello world!')).rejects.toThrow('not supported')
      await expect(adapter.count('Hello world!')).rejects.toThrow('not supported')
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
