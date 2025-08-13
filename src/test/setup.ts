import '@testing-library/jest-dom'

// Simplified worker mock
interface MockTokenizeMessage {
  id: string
  text: string
  operation: 'count' | 'encode'
}

class MockWorker {
  onmessage: ((ev: MessageEvent) => unknown) | null = null
  
  postMessage(message: MockTokenizeMessage): void {
    setTimeout(() => {
      if (this.onmessage) {
        const result = message.operation === 'count' 
          ? (message.text ? message.text.split(/\s+/).length : 0)
          : [1, 2, 3]
        
        const event: MessageEvent<{ id: string; success: boolean; result: number | number[] }> = {
          data: { id: message.id, success: true, result }
        } as MessageEvent<{ id: string; success: boolean; result: number | number[] }>
        this.onmessage(event)
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
// Assign mocks using unknown casts to avoid any
;(globalThis as unknown as { Worker: typeof MockWorker }).Worker = MockWorker
;(globalThis as unknown as { URL: typeof MockURL }).URL = MockURL
