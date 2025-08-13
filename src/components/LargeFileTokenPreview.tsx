import { useState, useCallback, useEffect } from 'react'
import { useSimpleTokenizer, type TokenInfo } from '../lib/useSimpleTokenizer'
import type { ModelInfo } from '../modelRegistry'

interface LargeFileTokenPreviewProps {
  text: string
  model: ModelInfo
  onClose: () => void
}

const PREVIEW_SAMPLE_SIZE = 1000 // Only process first 1KB for preview
const MAX_TOKENS_TO_SHOW = 100

function getTokenColor(tokenId: number): string {
  const hue = (tokenId * 137.508) % 360
  return `hsl(${hue}, 70%, 85%)`
}

export function LargeFileTokenPreview({ text, model, onClose }: LargeFileTokenPreviewProps) {
  const [showTokenIds, setShowTokenIds] = useState(false)
  const [sampleText, setSampleText] = useState('')
  const [tokens, setTokens] = useState<TokenInfo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  const { tokenizeText } = useSimpleTokenizer({
    onTokens: (tokenInfos) => {
      setTokens(tokenInfos.slice(0, MAX_TOKENS_TO_SHOW))
      setIsLoading(false)
    },
    onError: (error) => {
      console.error('Token preview error:', error)
      setIsLoading(false)
    }
  })

  // Create a sample from the beginning of the text
  useEffect(() => {
    const sample = text.slice(0, PREVIEW_SAMPLE_SIZE)
    setSampleText(sample)
    setIsLoading(true)
    
    // Process the sample
    tokenizeText(sample, model.tokenizerSpec).catch(console.error)
  }, [text, model.tokenizerSpec, tokenizeText])

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }, [onClose])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Token Preview (Sample)</h2>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">
              Showing first {MAX_TOKENS_TO_SHOW} tokens from {PREVIEW_SAMPLE_SIZE} characters
            </span>
            <button
              onClick={() => setShowTokenIds(!showTokenIds)}
              className="btn btn-secondary text-xs px-2 py-1"
              title={showTokenIds ? 'Show token text' : 'Show token IDs'}
            >
              {showTokenIds ? 'Text' : 'IDs'}
            </button>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-xl"
              aria-label="Close preview"
            >
              ×
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-auto p-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-gray-600">Processing sample...</div>
            </div>
          ) : (
            <div className="token-preview" role="list">
              {tokens.map(token => {
                const tokenColor = getTokenColor(token.id)
                
                return (
                  <span 
                    key={token.index} 
                    className="token-chip"
                    style={{ backgroundColor: tokenColor }}
                    role="listitem" 
                    title={`Token ${token.index + 1}: "${token.text}" (ID: ${token.id}, chars ${token.start}-${token.end})`}
                  >
                    {showTokenIds ? token.id : token.text}
                  </span>
                )
              })}
              {text.length > PREVIEW_SAMPLE_SIZE && (
                <div className="mt-4 p-3 bg-yellow-50 rounded border-l-4 border-yellow-400">
                  <p className="text-sm text-yellow-800">
                    This is a preview of the first {PREVIEW_SAMPLE_SIZE} characters only. 
                    Full file has {text.length.toLocaleString()} characters.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="p-4 border-t bg-gray-50">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Press Escape to close</span>
            <span>Sample: {sampleText.length} chars → {tokens.length} tokens</span>
          </div>
        </div>
      </div>
    </div>
  )
}
