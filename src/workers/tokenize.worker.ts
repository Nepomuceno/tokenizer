import { tokenizerFactory } from '../lib/tokenizerFactory'
import type { TokenizerSpec, TokenizerAdapter } from '../adapters/types'

export interface TokenizeRequest {
  id: string
  text: string
  spec: TokenizerSpec
  operation: 'count' | 'encode'
}

export interface TokenizeResponse {
  id: string
  success: boolean
  result?: number | number[]
  error?: string
}

// Configuration for chunked processing
const CHUNK_SIZE = 50000 // 50KB chunks for large texts
const LARGE_TEXT_THRESHOLD = 100000 // 100KB

self.onmessage = async (event: MessageEvent<TokenizeRequest>) => {
  const { id, text, spec, operation } = event.data
  
  try {
    const adapter = await tokenizerFactory.getAdapter(spec)
    
    let result: number | number[]
    
    // Use chunking for large texts to avoid blocking the worker
    if (text.length > LARGE_TEXT_THRESHOLD && operation === 'count') {
      result = await countTokensChunked(text, adapter)
    } else if (operation === 'count') {
      result = await adapter.count(text)
    } else {
      result = await adapter.encode(text)
    }
    
    const response: TokenizeResponse = {
      id,
      success: true,
      result
    }
    
    self.postMessage(response)
  } catch (error) {
    const response: TokenizeResponse = {
      id,
      success: false,
      error: error instanceof Error ? error.message : String(error)
    }
    
    self.postMessage(response)
  }
}

// Chunked counting for large texts to prevent worker blocking
async function countTokensChunked(text: string, adapter: TokenizerAdapter): Promise<number> {
  if (text.length <= CHUNK_SIZE) {
    return await adapter.count(text)
  }
  
  let totalCount = 0
  const chunks: string[] = []
  
  // Split text into chunks at word boundaries when possible
  for (let i = 0; i < text.length; i += CHUNK_SIZE) {
    let end = Math.min(i + CHUNK_SIZE, text.length)
    
    // Try to break at word boundary unless we're at the end
    if (end < text.length) {
      const lastSpace = text.lastIndexOf(' ', end)
      const lastNewline = text.lastIndexOf('\n', end)
      const breakPoint = Math.max(lastSpace, lastNewline)
      
      if (breakPoint > i) {
        end = breakPoint
      }
    }
    
    chunks.push(text.slice(i, end))
    i = end - CHUNK_SIZE // Adjust for the boundary break
  }
  
  // Process chunks with small delays to keep worker responsive
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i]
    totalCount += await adapter.count(chunk)
    
    // Yield control periodically for very large files
    if (i % 10 === 0 && i > 0) {
      await new Promise(resolve => setTimeout(resolve, 1))
    }
  }
  
  return totalCount
}
