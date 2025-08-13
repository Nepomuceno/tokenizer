import { describe, it, expect, beforeAll, vi } from 'vitest'
import { HuggingFaceAdapter } from '../adapters/huggingface'

// Mock tokenizer data for testing
const mockTokenizerData = {
  "version": "1.0",
  "model": {
    "type": "BPE",
    "vocab": {
      "!": 0,
      "\"": 1,
      "#": 2,
      "$": 3,
      "%": 4,
      "&": 5,
      "'": 6,
      "(": 7,
      ")": 8,
      "*": 9,
      "+": 10,
      ",": 11,
      "-": 12,
      ".": 13,
      "/": 14,
      "0": 15,
      "1": 16,
      "2": 17,
      "3": 18,
      "4": 19,
      "5": 20,
      "6": 21,
      "7": 22,
      "8": 23,
      "9": 24,
      ":": 25,
      ";": 26,
      "<": 27,
      "=": 28,
      ">": 29,
      "?": 30,
      "@": 31,
      "A": 32,
      "B": 33,
      "C": 34,
      "D": 35,
      "E": 36,
      "F": 37,
      "G": 38,
      "H": 39,
      "I": 40,
      "J": 41,
      "K": 42,
      "L": 43,
      "M": 44,
      "N": 45,
      "O": 46,
      "P": 47,
      "Q": 48,
      "R": 49,
      "S": 50,
      "T": 51,
      "U": 52,
      "V": 53,
      "W": 54,
      "X": 55,
      "Y": 56,
      "Z": 57,
      "[": 58,
      "\\": 59,
      "]": 60,
      "^": 61,
      "_": 62,
      "`": 63,
      "a": 64,
      "b": 65,
      "c": 66,
      "d": 67,
      "e": 68,
      "f": 69,
      "g": 70,
      "h": 71,
      "i": 72,
      "j": 73,
      "k": 74,
      "l": 75,
      "m": 76,
      "n": 77,
      "o": 78,
      "p": 79,
      "q": 80,
      "r": 81,
      "s": 82,
      "t": 83,
      "u": 84,
      "v": 85,
      "w": 86,
      "x": 87,
      "y": 88,
      "z": 89,
      "{": 90,
      "|": 91,
      "}": 92,
      "~": 93,
      "▁": 94,
      "▁the": 95,
      "▁of": 96,
      "▁and": 97,
      "▁to": 98,
      "▁a": 99,
      "▁in": 100,
      "▁is": 101,
      "▁for": 102,
      "▁that": 103,
      "▁with": 104,
      "▁on": 105,
      "▁as": 106,
      "▁it": 107,
      "▁be": 108,
      "▁at": 109,
      "▁by": 110,
      "▁this": 111,
      "▁have": 112,
      "▁from": 113,
      "▁or": 114,
      "▁an": 115,
      "▁are": 116,
      "▁but": 117,
      "▁not": 118,
      "▁you": 119,
      "▁all": 120,
      "▁can": 121,
      "▁had": 122,
      "▁was": 123,
      "▁one": 124,
      "▁our": 125,
      "▁out": 126,
      "▁day": 127,
      "▁get": 128,
      "▁has": 129,
      "▁him": 130,
      "▁his": 131,
      "▁how": 132,
      "▁man": 133,
      "▁new": 134,
      "▁now": 135,
      "▁old": 136,
      "▁see": 137,
      "▁two": 138,
      "▁way": 139,
      "▁who": 140,
      "Hello": 200,
      "world": 201,
      "test": 202
    },
    "merges": [
      "▁ t",
      "▁ a",
      "h e",
      "i n",
      "r e",
      "o n"
    ]
  }
}

describe('HuggingFaceAdapter', () => {
  let adapter: HuggingFaceAdapter

  beforeAll(async () => {
    // Mock fetch to return our test tokenizer data
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockTokenizerData),
      text: () => Promise.resolve(JSON.stringify(mockTokenizerData))
    } as Response)

    adapter = new HuggingFaceAdapter('/tokenizers/test.json')
    await adapter.init()
  })

  it('should initialize successfully', () => {
    expect(adapter).toBeDefined()
  })

  it('should encode text and return token IDs', async () => {
    const text = 'Hello world'
    const tokenIds = await adapter.encode(text)
    
    expect(tokenIds).toBeInstanceOf(Array)
    expect(tokenIds.length).toBeGreaterThan(0)
    expect(tokenIds.every(id => typeof id === 'number')).toBe(true)
  })

  it('should count tokens correctly', async () => {
    const text = 'Hello world'
    const count = await adapter.count(text)
    const tokenIds = await adapter.encode(text)
    
    expect(count).toBe(tokenIds.length)
    expect(count).toBeGreaterThan(0)
  })

  it('should handle empty text', async () => {
    const tokenIds = await adapter.encode('')
    const count = await adapter.count('')
    
    expect(tokenIds).toEqual([])
    expect(count).toBe(0)
  })

  it('should handle longer text', async () => {
    const text = 'This is a longer piece of text that should be tokenized properly.'
    const tokenIds = await adapter.encode(text)
    const count = await adapter.count(text)
    
    expect(tokenIds.length).toBeGreaterThan(5)
    expect(count).toBe(tokenIds.length)
  })

  it('should throw error if not initialized', async () => {
    const uninitializedAdapter = new HuggingFaceAdapter('/tokenizers/test.json')
    
    await expect(uninitializedAdapter.encode('test')).rejects.toThrow('not initialized')
    await expect(uninitializedAdapter.count('test')).rejects.toThrow('not initialized')
  })

  it('should throw error for invalid tokenizer path', async () => {
    // Mock fetch to return 404 for this test
    const mockFetchReject = vi.fn().mockResolvedValue({
      ok: false,
      statusText: 'Not Found'
    } as Response)

    globalThis.fetch = mockFetchReject
    
    const invalidAdapter = new HuggingFaceAdapter('/nonexistent/tokenizer.json')
    
    await expect(invalidAdapter.init()).rejects.toThrow('Failed to initialize HuggingFace tokenizer')
  })
})
