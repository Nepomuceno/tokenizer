import { useCallback, useEffect, useRef, useState } from 'react'
import type { TokenizeRequest, TokenizeResponse } from '../workers/tokenize.worker'
import type { TokenizerSpec } from '../adapters/types'

export interface UseTokenizerOptions {
  onTokenCount?: (count: number) => void
  onError?: (error: string) => void
}

export function useTokenizer(options: UseTokenizerOptions = {}) {
  const workerRef = useRef<Worker | null>(null)
  const pendingRequests = useRef(new Map<string, (response: TokenizeResponse) => void>())
  const requestIdCounter = useRef(0)
  const [isTokenizing, setIsTokenizing] = useState(false)

  // Initialize worker
  useEffect(() => {
    // Create worker lazily
    if (!workerRef.current) {
      workerRef.current = new Worker(
        new URL('../workers/tokenize.worker.ts', import.meta.url),
        { type: 'module' }
      )

      workerRef.current.onmessage = (event: MessageEvent<TokenizeResponse>) => {
        const response = event.data
        const handler = pendingRequests.current.get(response.id)
        
        if (handler) {
          handler(response)
          pendingRequests.current.delete(response.id)
        }
      }
    }

    // Capture map reference at effect creation to satisfy exhaustive-deps rule
    const pendingMap = pendingRequests.current
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate()
        workerRef.current = null
      }
      pendingMap.clear()
    }
  }, [])

  const countTokens = useCallback(async (text: string, spec: TokenizerSpec): Promise<number> => {
    return new Promise((resolve, reject) => {
      if (!workerRef.current) {
        reject(new Error('Worker not initialized'))
        return
      }

      const id = `count-${++requestIdCounter.current}`
      setIsTokenizing(true)
      
      pendingRequests.current.set(id, (response) => {
        setIsTokenizing(false)
        if (response.success) {
          const count = response.result as number
          options.onTokenCount?.(count)
          resolve(count)
        } else {
          const error = response.error || 'Unknown error'
          options.onError?.(error)
          reject(new Error(error))
        }
      })

      const request: TokenizeRequest = {
        id,
        text,
        spec,
        operation: 'count'
      }

      workerRef.current.postMessage(request)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps -- options callbacks considered stable
  }, [options.onTokenCount, options.onError])

  const encodeTokens = useCallback(async (text: string, spec: TokenizerSpec): Promise<number[]> => {
    return new Promise((resolve, reject) => {
      if (!workerRef.current) {
        reject(new Error('Worker not initialized'))
        return
      }

      const id = `encode-${++requestIdCounter.current}`
      setIsTokenizing(true)
      
      pendingRequests.current.set(id, (response) => {
        setIsTokenizing(false)
        if (response.success) {
          resolve(response.result as number[])
        } else {
          const error = response.error || 'Unknown error'
          options.onError?.(error)
          reject(new Error(error))
        }
      })

      const request: TokenizeRequest = {
        id,
        text,
        spec,
        operation: 'encode'
      }

      workerRef.current.postMessage(request)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps -- options.onError considered stable
  }, [options.onError])

  return {
    countTokens,
    encodeTokens,
    isTokenizing
  }
}
