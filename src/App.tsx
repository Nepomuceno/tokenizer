import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { getAllModels, getModelInfo } from './modelRegistry'
import { useTokenizer } from './lib/useTokenizer'
import { useSimpleTokenizer, type TokenInfo } from './lib/useSimpleTokenizer'
import { CostCalculator } from './components/CostCalculator'
import { Banner } from './components/Banner'
import { FileIcon, FileUploadIcon, FileProcessingIcon } from './components/FileIcons'

const MODELS = getAllModels()

// Configuration for large file handling
const PERFORMANCE_CONFIG = {
  LARGE_FILE_THRESHOLD: 500000, // 500KB chars - reduced threshold
  MAX_TOKENS_TO_DISPLAY: 400,
  MAX_TOKENS_FOR_DETAILED_VIEW: 100,
  CHUNK_SIZE_FOR_PROCESSING: 100000, // 100KB chunks
  PREVIEW_SAMPLE_SIZE: 50000 // 50KB sample for large file preview
}

function getTokenColor(tokenId: number): string {
  // Use token ID for consistent color generation
  const hue = (tokenId * 137.508) % 360 // Golden angle approximation for better distribution
  return `hsl(${hue}, 70%, 85%)`
}

function App() {
  const [text, setText] = useState('')
  const [modelKey, setModelKey] = useState<string>(MODELS[0].key)
  const [charCount, setCharCount] = useState(0)
  const [tokenCount, setTokenCount] = useState(0)
  const [tokens, setTokens] = useState<TokenInfo[]>([])
  const [tokenError, setTokenError] = useState<string>()
  const [showTokenPreview, setShowTokenPreview] = useState(true)
  const [isLargeFile, setIsLargeFile] = useState(false)
  const [showTokenIds, setShowTokenIds] = useState(false)
  const [isLoadingFile, setIsLoadingFile] = useState(false)
  const [loadedFileName, setLoadedFileName] = useState<string>()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  
  // Cache for tokenization results to avoid re-processing same text
  const tokenizationCache = useRef(new Map<string, { count: number, tokens: TokenInfo[] }>())

  const model = useMemo(() => getModelInfo(modelKey)!, [modelKey])

  // Memoized callbacks to prevent unnecessary re-renders
  const handleTokenCount = useCallback((count: number) => {
    setTokenCount(count)
  }, [])

  const handleTokens = useCallback((tokenInfos: TokenInfo[]) => {
    setTokens(tokenInfos)
  }, [])

  const handleError = useCallback((error: string) => {
    setTokenError(error)
  }, [])

  // Use worker-based tokenizer for counting only
  const { countTokens, isTokenizing: isCountingTokens } = useTokenizer({
    onTokenCount: handleTokenCount,
    onError: handleError
  })

  // Use simple tokenizer for token visualization (only for smaller files)
  const { tokenizeText, isTokenizing: isTokenizingForPreview } = useSimpleTokenizer({
    onTokenCount: handleTokenCount,
    onTokens: handleTokens,
    onError: handleError
  })

  const isTokenizing = isCountingTokens || isTokenizingForPreview
  const isProcessing = isTokenizing || isLoadingFile

  // Track if file is large for performance optimizations
  useEffect(() => {
    const large = text.length > PERFORMANCE_CONFIG.LARGE_FILE_THRESHOLD
    setIsLargeFile(large)
    if (large && showTokenPreview) {
      setShowTokenPreview(false) // Auto-disable token preview for large files
    }
  }, [text.length, showTokenPreview])

  // Memoized cache key to prevent unnecessary re-tokenization
  const cacheKey = useMemo(() => {
    return `${text}-${model.tokenizerSpec.type}-${model.tokenizerSpec.model || ''}`
  }, [text, model.tokenizerSpec])

  // Tokenize whenever text or model changes (with caching and debouncing)
  useEffect(() => {
    setCharCount(text.length)
    
    if (!text.trim()) {
      setTokenCount(0)
      setTokens([])
      setTokenError(undefined)
      return
    }

    // Check cache first
    const cached = tokenizationCache.current.get(cacheKey)
    if (cached) {
      setTokenCount(cached.count)
      setTokens(cached.tokens)
      setTokenError(undefined)
      return
    }

    setTokenError(undefined)
    
    const debounceDelay = isLargeFile ? 1000 : 200
    const id = setTimeout(async () => {
      try {
        if (isLargeFile) {
          // For large files, get full count from worker + preview from first chunk
          const countPromise = countTokens(text, model.tokenizerSpec)
          
          // Get token preview from first chunk only
          const sampleText = text.slice(0, PERFORMANCE_CONFIG.PREVIEW_SAMPLE_SIZE)
          const previewPromise = tokenizeText(sampleText, model.tokenizerSpec)
          
          const [count, previewResult] = await Promise.all([countPromise, previewPromise])
          
          const result = { 
            count, 
            tokens: previewResult.tokens.map(token => ({
              ...token,
              // Mark these as preview tokens
              isPreview: true
            }))
          }
          tokenizationCache.current.set(cacheKey, result)
        } else if (!showTokenPreview) {
          // For smaller files when preview is disabled, only count tokens
          const count = await countTokens(text, model.tokenizerSpec)
          const result = { count, tokens: [] }
          tokenizationCache.current.set(cacheKey, result)
        } else {
          // For smaller files with preview enabled, get full tokenization
          const result = await tokenizeText(text, model.tokenizerSpec)
          tokenizationCache.current.set(cacheKey, result)
        }
      } catch (error) {
        console.error('Tokenization error:', error)
        setTokenError((error as Error).message)
      }
    }, debounceDelay)
    
    return () => clearTimeout(id)
  }, [cacheKey, isLargeFile, showTokenPreview, countTokens, tokenizeText])

  const overCtx = tokenCount > model.contextWindow
  const pct = Math.min(100, (tokenCount / model.contextWindow) * 100 || 0)

  const handleFilePick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const onFileSelected = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 10 * 1024 * 1024) {
      // Increased limit but still reasonable
      alert('File too large (>10MB). Please select a smaller file.')
      return
    }
    
    // Immediately show loading state
    setIsLoadingFile(true)
    setLoadedFileName(file.name)
    
    // Clear previous state
    tokenizationCache.current.clear()
    setTokenError(undefined)
    setTokens([])
    setTokenCount(0)
    
    const reader = new FileReader()
    reader.onload = () => {
      setText(String(reader.result || ''))
      setIsLoadingFile(false)
    }
    reader.onerror = () => {
      setTokenError('Failed to read file')
      setIsLoadingFile(false)
    }
    reader.readAsText(file)
  }, [])

  // Clear cache when model changes
  useEffect(() => {
    tokenizationCache.current.clear()
  }, [modelKey])

  return (
    <div className="app-shell">
      <Banner />
      <div className="mb-6 flex items-start gap-6 flex-col lg:flex-row">
        {/* Left column */}
        <div className="flex-1 w-full max-w-xl space-y-4">
          <div>
            <button 
              onClick={handleFilePick} 
              className={`btn btn-primary flex items-center gap-2 ${isLoadingFile ? 'opacity-75 cursor-wait' : ''}`} 
              aria-label="Select a file to count tokens"
              disabled={isLoadingFile}
            >
              {isLoadingFile ? (
                <>
                  <FileProcessingIcon width={20} height={20} className="animate-pulse" />
                  Loading {loadedFileName}...
                </>
              ) : (
                <>
                  <FileUploadIcon width={20} height={20} />
                  Count from file
                </>
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.md,.csv,.json,.log"
              className="hidden-input"
              onChange={onFileSelected}
            />
          </div>
          <div className="input-wrapper" aria-label="Text input area">
            <textarea
              className="input-area"
              placeholder="Add your text"
              value={text}
              onChange={e => setText(e.target.value)}
              aria-describedby="counts-live"
            />
          </div>
          <div className="token-preview" aria-label="Token preview" role="region">
            {isLoadingFile && (
              <div className="text-sm text-[var(--tc-info)] px-3 py-2 bg-blue-50 rounded border-l-2 border-blue-300 flex items-center gap-2">
                <FileProcessingIcon width={16} height={16} className="animate-pulse" />
                Loading file "{loadedFileName}"...
              </div>
            )}
            {isTokenizing && (
              <div className="text-sm text-[var(--tc-muted)] px-3 py-2 bg-blue-50 rounded border-l-2 border-blue-300 flex items-center gap-2">
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                {isLargeFile ? 'Processing large file...' : 'Tokenizing...'}
              </div>
            )}
            {tokenError && (
              <div className="text-sm text-[var(--tc-danger)] px-3 py-2 bg-red-50 rounded border-l-2 border-red-300">
                Error: {tokenError}
              </div>
            )}
            {isLargeFile && !isTokenizing && !tokenError && tokens.length > 0 && (
              <>
                <div className="text-sm text-[var(--tc-info)] px-3 py-2 bg-blue-50 rounded border-l-2 border-blue-300 mb-2">
                  Showing preview of first {PERFORMANCE_CONFIG.PREVIEW_SAMPLE_SIZE.toLocaleString()} characters 
                  ({tokens.length} tokens). Full file: {charCount.toLocaleString()} chars, {tokenCount.toLocaleString()} tokens.
                </div>
                {tokens.slice(0, PERFORMANCE_CONFIG.MAX_TOKENS_TO_DISPLAY).map(token => {
                  const tokenColor = getTokenColor(token.id)
                  
                  return (
                    <span 
                      key={token.index} 
                      className="token-chip"
                      style={{ backgroundColor: tokenColor }}
                      role="listitem" 
                      title={`Preview Token ${token.index + 1}: "${token.text}" (ID: ${token.id})`}
                    >
                      {showTokenIds ? token.id : token.text}
                    </span>
                  )
                })}
                {tokens.length > PERFORMANCE_CONFIG.MAX_TOKENS_TO_DISPLAY && (
                  <span className="text-xs text-[var(--tc-muted)] px-2 py-1 bg-gray-50 rounded border-l-2 border-gray-300">
                    + {tokens.length - PERFORMANCE_CONFIG.MAX_TOKENS_TO_DISPLAY} more preview tokens
                  </span>
                )}
              </>
            )}
            {isLargeFile && !isTokenizing && !tokenError && tokens.length === 0 && (
              <div className="text-sm text-[var(--tc-muted)] px-3 py-2 bg-yellow-50 rounded border-l-2 border-yellow-300">
                Large file detected ({charCount.toLocaleString()} characters). Generating token preview...
                <button 
                  onClick={() => setShowTokenPreview(true)}
                  className="ml-2 text-orange-600 hover:text-orange-800 underline text-xs"
                >
                  Enable full preview (may lag)
                </button>
              </div>
            )}
            {!isLargeFile && !isTokenizing && !tokenError && tokens.length > 0 && (
              <>
                {tokens.slice(0, PERFORMANCE_CONFIG.MAX_TOKENS_TO_DISPLAY).map(token => {
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
                {tokens.length > PERFORMANCE_CONFIG.MAX_TOKENS_TO_DISPLAY && (
                  <span className="text-xs text-[var(--tc-muted)] px-2 py-1 bg-gray-50 rounded border-l-2 border-gray-300">
                    + {tokens.length - PERFORMANCE_CONFIG.MAX_TOKENS_TO_DISPLAY} more tokens (truncated for performance)
                  </span>
                )}
              </>
            )}
            {!isTokenizing && !tokenError && text.trim() && tokenCount === 0 && (
              <div className="text-sm text-[var(--tc-muted)] px-3 py-2 bg-gray-50 rounded border-l-2 border-gray-300">
                No tokens found
              </div>
            )}
            {!isLargeFile && !isTokenizing && !tokenError && text.trim() && tokenCount > 0 && tokens.length === 0 && (
              <div className="text-sm text-[var(--tc-muted)] px-3 py-2 bg-green-50 rounded border-l-2 border-green-300">
                Tokenization complete: {tokenCount.toLocaleString()} tokens from {charCount.toLocaleString()} characters
                <button 
                  onClick={() => setShowTokenPreview(true)}
                  className="ml-2 text-blue-600 hover:text-blue-800 underline text-xs"
                >
                  Show token preview
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="w-full max-w-xs space-y-4">
          <div className="stats-grid" aria-label="Counts">
            <div className="stat-box">
              <span className="stat-label">Characters</span>
              <span className="stat-value" id="char-count">
                {isLoadingFile ? (
                  <span className="text-blue-600 animate-pulse">Loading...</span>
                ) : (
                  charCount.toLocaleString()
                )}
              </span>
            </div>
            <div className="stat-box">
              <span className="stat-label">Tokens</span>
              <span className="stat-value" id="token-count">
                {isLoadingFile || isTokenizing ? (
                  <span className="text-blue-600 animate-pulse">
                    {isLoadingFile ? 'Loading...' : 'Processing...'}
                  </span>
                ) : (
                  tokenCount.toLocaleString()
                )}
              </span>
            </div>
          </div>
          
          {/* Token Display Toggle */}
          {tokens.length > 0 && (
            <div className="panel p-3" aria-label="Token display options">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="stat-label">Token Display</span>
                  {isLargeFile && tokens.some(t => t.isPreview) && (
                    <span className="text-xs text-[var(--tc-muted)]">Preview mode</span>
                  )}
                </div>
                <button
                  onClick={() => setShowTokenIds(!showTokenIds)}
                  className="btn btn-secondary text-xs px-2 py-1"
                  title={showTokenIds ? 'Show token text' : 'Show token IDs'}
                >
                  {showTokenIds ? 'Text' : 'IDs'}
                </button>
              </div>
            </div>
          )}
          
          {/* Performance Info */}
          {isLargeFile && (
            <div className="panel p-3" aria-label="Performance info">
              <div className="text-xs text-[var(--tc-muted)] space-y-1">
                <div className="flex items-center justify-between">
                  <span>File size:</span>
                  <span className="font-mono">{(charCount / 1024 / 1024).toFixed(2)} MB</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Processing:</span>
                  <span className="text-green-600">✓ Web Worker</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Cache:</span>
                  <button 
                    onClick={() => tokenizationCache.current.clear()}
                    className="text-blue-600 hover:text-blue-800 underline text-xs"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          )}
          
          <div className="panel p-3 space-y-2" aria-label="Model selector">
            <label className="stat-label" htmlFor="model">Model family</label>
            <select
              id="model"
              className="select w-full"
              value={modelKey}
              onChange={e => setModelKey(e.target.value)}
            >
              {MODELS.map(m => <option key={m.key} value={m.key}>{m.label}</option>)}
            </select>
            <div className={`context-badge ${overCtx ? 'context-over' : ''}`}>ctx {model.contextWindow.toLocaleString()}</div>
            <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden" aria-hidden="true">
              <div className={`h-full ${overCtx ? 'bg-[var(--tc-danger)]' : 'bg-[var(--tc-accent)]'}`} style={{ width: pct + '%' }} />
            </div>
            {overCtx && <p className="text-xs text-[var(--tc-danger)]">Over context window</p>}
          </div>
          <div className="text-xs text-[var(--tc-muted)] leading-relaxed">
            {isLargeFile 
              ? "Large file mode: Using optimized Web Worker processing for better performance."
              : "Tokenization uses Web Workers for optimal performance. Real model token counts may vary."
            }
          </div>
          
          {/* Cost Calculator */}
          <CostCalculator tokenCount={tokenCount} model={model} />
        </div>
      </div>
      <div id="counts-live" className="sr-only" aria-live="polite">
        {charCount} characters, {tokenCount} tokens.
      </div>
    </div>
  )
}

export default App
