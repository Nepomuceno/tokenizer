import { describe, it, expect, beforeEach } from 'vitest'
import { TikTokenAdapter } from '../adapters/tiktoken'

describe('TikToken Adapter', () => {
  let adapter: TikTokenAdapter

  beforeEach(async () => {
    adapter = new TikTokenAdapter('cl100k_base')
    try {
      await adapter.init()
    } catch (error) {
      console.warn('Failed to initialize TikToken adapter:', error)
      throw new Error('TikToken WASM failed to load - this might be expected in test environment')
    }
  })

  it('should count tokens correctly for simple text', async () => {
    const text = 'Hello world'
    const tokens = await adapter.encode(text)
    const count = await adapter.count(text)
    
    console.log('Text:', text)
    console.log('Tokens:', tokens)
    console.log('Token count from encode():', tokens.length)
    console.log('Token count from count():', count)
    
    expect(count).toBe(tokens.length)
    expect(tokens.length).toBeGreaterThan(0)
  })

  it('should handle text ending with punctuation', async () => {
    const text = 'Hello world!'
    const tokens = await adapter.encode(text)
    const count = await adapter.count(text)
    
    console.log('Text with punctuation:', text)
    console.log('Tokens:', tokens)
    console.log('Token count from encode():', tokens.length)
    console.log('Token count from count():', count)
    
    expect(count).toBe(tokens.length)
  })

  it('should handle text with trailing spaces', async () => {
    const text = 'Hello world   '
    const tokens = await adapter.encode(text)
    const count = await adapter.count(text)
    
    console.log('Text with trailing spaces:', JSON.stringify(text))
    console.log('Tokens:', tokens)
    console.log('Token count from encode():', tokens.length)
    console.log('Token count from count():', count)
    
    expect(count).toBe(tokens.length)
  })

  it('should handle multiline text', async () => {
    const text = 'Hello\nworld\n'
    const tokens = await adapter.encode(text)
    const count = await adapter.count(text)
    
    console.log('Multiline text:', JSON.stringify(text))
    console.log('Tokens:', tokens)
    console.log('Token count from encode():', tokens.length)
    console.log('Token count from count():', count)
    
    expect(count).toBe(tokens.length)
  })

  it('should handle empty text', async () => {
    const text = ''
    const tokens = await adapter.encode(text)
    const count = await adapter.count(text)
    
    console.log('Empty text')
    console.log('Tokens:', tokens)
    console.log('Token count from encode():', tokens.length)
    console.log('Token count from count():', count)
    
    expect(count).toBe(tokens.length)
    expect(count).toBe(0)
  })

  it('should handle text with special characters', async () => {
    const text = 'Hello world! 👋 How are you?'
    const tokens = await adapter.encode(text)
    const count = await adapter.count(text)
    
    console.log('Text with special chars:', text)
    console.log('Tokens:', tokens)
    console.log('Token count from encode():', tokens.length)
    console.log('Token count from count():', count)
    
    expect(count).toBe(tokens.length)
  })

  it('should test o200k_base encoding', async () => {
    const o200kAdapter = new TikTokenAdapter('o200k_base')
    await o200kAdapter.init()
    
    const text = 'Hello world!'
    const tokens = await o200kAdapter.encode(text)
    const count = await o200kAdapter.count(text)
    
    console.log('o200k_base encoding for:', text)
    console.log('Tokens:', tokens)
    console.log('Token count from encode():', tokens.length)
    console.log('Token count from count():', count)
    
    expect(count).toBe(tokens.length)
  })

  it('should handle specific edge case that might cause last token issue', async () => {
    // Test some common patterns that might cause token counting issues
    const testCases = [
      'The quick brown fox',
      'The quick brown fox.',
      'The quick brown fox. ',
      'Hello world\n',
      'Hello world\n\n',
      'Test with 123 numbers',
      'Test with @#$ symbols',
    ]

    for (const text of testCases) {
      const tokens = await adapter.encode(text)
      const count = await adapter.count(text)
      
      console.log(`Testing: ${JSON.stringify(text)}`)
      console.log(`  Tokens: [${tokens.slice(0, 10).join(', ')}${tokens.length > 10 ? '...' : ''}]`)
      console.log(`  encode().length: ${tokens.length}, count(): ${count}`)
      
      expect(count).toBe(tokens.length)
    }
  })
})
