import { useCallback, useState } from 'react'
import { tokenizerFactory } from './tokenizerFactory'
import type { TokenizerSpec, TokenizerAdapter } from '../adapters/types'

export interface TokenInfo {
  text: string
  id: number
  index: number
  start: number
  end: number
  isPreview?: boolean // Optional flag to indicate this is from a preview sample
}

export interface UseSimpleTokenizerOptions {
  onTokenCount?: (count: number) => void
  onTokens?: (tokens: TokenInfo[]) => void
  onError?: (error: string) => void
}

/**
 * Simple tokenizer hook that runs in the main thread.
 * This is a fallback for when Web Workers have issues.
 */
export function useSimpleTokenizer(options: UseSimpleTokenizerOptions = {}) {
  const [isTokenizing, setIsTokenizing] = useState(false)

  const tokenizeText = useCallback(async (text: string, spec: TokenizerSpec): Promise<{ count: number, tokens: TokenInfo[] }> => {
    try {
      setIsTokenizing(true)
      
      // Use the tokenizer factory directly
      const adapter = await tokenizerFactory.getAdapter(spec)
      
      // Get the actual tokens from the tokenizer
      const tokenIds = await adapter.encode(text)
      const count = tokenIds.length
      
      // Get the actual token strings by reconstructing from the SimpleTokenizerAdapter
      const tokenInfos = await getActualTokens(text, adapter)
      
      options.onTokenCount?.(count)
      options.onTokens?.(tokenInfos)
      setIsTokenizing(false)
      
      return { count, tokens: tokenInfos }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      options.onError?.(errorMessage)
      setIsTokenizing(false)
      throw error
    }
  }, [options])

  const countTokens = useCallback(async (text: string, spec: TokenizerSpec): Promise<number> => {
    const result = await tokenizeText(text, spec)
    return result.count
  }, [tokenizeText])

  const encodeTokens = useCallback(async (text: string, spec: TokenizerSpec): Promise<number[]> => {
    try {
      setIsTokenizing(true)
      
      const adapter = await tokenizerFactory.getAdapter(spec)
      const tokens = await adapter.encode(text)
      
      setIsTokenizing(false)
      
      return tokens
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      options.onError?.(errorMessage)
      setIsTokenizing(false)
      throw error
    }
  }, [])

  return {
    countTokens,
    encodeTokens,
    tokenizeText,
    isTokenizing
  }
}

// Get actual tokens directly from the tokenizer adapter
async function getActualTokens(text: string, adapter: TokenizerAdapter): Promise<TokenInfo[]> {
  if (!text) {
    return []
  }

  // Get token IDs from the adapter
  const tokenIds = await adapter.encode(text)
  
  // For TikToken adapter, we need to decode each token individually to get the strings
  const tokens: TokenInfo[] = []
  
  // Check if this is a TikToken adapter with decode capability
  if ((adapter as any).decode) {
    // TikToken path - decode each token individually to get the actual token strings
    for (let i = 0; i < tokenIds.length; i++) {
      const tokenId = tokenIds[i]
      try {
        // Decode single token to get its string representation
        const tokenText = await (adapter as any).decode([tokenId])
        
        tokens.push({
          text: tokenText,
          id: tokenId,
          index: i,
          start: 0, // We'll calculate positions later for TikToken
          end: 0
        })
      } catch (error) {
        // Fallback if decode fails for individual token
        tokens.push({
          text: `<token_${tokenId}>`,
          id: tokenId,
          index: i,
          start: 0,
          end: 0
        })
      }
    }
    
    // For TikToken, calculate positions by reconstructing the full text
    let currentPos = 0
    for (const token of tokens) {
      token.start = currentPos
      token.end = currentPos + token.text.length
      currentPos += token.text.length
    }
  } else {
    // Simple tokenizer fallback
    const tokenStrings = (adapter as any).tokenize ? (adapter as any).tokenize(text) : getTokenStrings(text)
    let currentPos = 0
    
    for (let i = 0; i < Math.min(tokenIds.length, tokenStrings.length); i++) {
      const tokenText = tokenStrings[i]
      const start = currentPos
      
      tokens.push({
        text: tokenText,
        id: tokenIds[i],
        index: i,
        start: start,
        end: start + tokenText.length
      })
      
      currentPos += tokenText.length
    }
  }
  
  return tokens
}

// Fallback tokenization (should not be needed if adapter has tokenize method)
function getTokenStrings(text: string): string[] {
  if (!text) {
    return []
  }

  const tokens: string[] = []
  let currentToken = ''
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    
    // If it's punctuation, treat it as a separate token
    if (/[.,!?;:()[\]{}"'`~@#$%^&*+=|\\/<>]/.test(char)) {
      if (currentToken) {
        tokens.push(currentToken)
        currentToken = ''
      }
      tokens.push(char)
    }
    // If it's whitespace, end current token but preserve the space
    else if (/\s/.test(char)) {
      if (currentToken) {
        tokens.push(currentToken)
        currentToken = ''
      }
      tokens.push(char)
    }
    // Otherwise, add to current token
    else {
      currentToken += char
    }
  }
  
  // Add remaining token
  if (currentToken) {
    tokens.push(currentToken)
  }
  
  return tokens
}
