import '@testing-library/jest-dom'

// Simplified worker mock
class MockWorker {
  onmessage: ((ev: MessageEvent) => any) | null = null
  
  postMessage(message: any): void {
    setTimeout(() => {
      if (this.onmessage) {
        const result = message.operation === 'count' 
          ? (message.text ? message.text.split(/\s+/).length : 0)
          : [1, 2, 3]
        
        this.onmessage({
          data: {
            id: message.id,
            success: true,
            result
          }
        } as MessageEvent)
      }
    }, 50)
  }
  
  terminate(): void {}
}

// Mock URL 
class MockURL {
  href: string
  constructor(url: string) {
    this.href = url
  }
}

// Assign to globalThis which is available in both Node and browser
;(globalThis as any).Worker = MockWorker
;(globalThis as any).URL = MockURL
