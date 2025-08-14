import type { TokenizerSpec } from './adapters/types'

export interface ModelInfo {
  key: string
  label: string
  contextWindow: number
  tokenizerSpec: TokenizerSpec
  pricing?: {
    inputPer1K: number
    outputPer1K: number
  }
  /** Disabled when tokenizer adapter not fully implemented */
  disabled?: boolean
}

export const MODEL_REGISTRY: Record<string, ModelInfo> = {

  // OpenAI Models
  'gpt-4o': {
    key: 'gpt-4o',
    label: 'GPT-4o',
    contextWindow: 128000,
    tokenizerSpec: {
      type: 'tiktoken',
      encoding: 'o200k_base'
    },
    pricing: {
      inputPer1K: 2.5,
      outputPer1K: 10.0
    }
  },
  'gpt-4o-mini': {
    key: 'gpt-4o-mini',
    label: 'GPT-4o Mini',
    contextWindow: 128000,
    tokenizerSpec: {
      type: 'tiktoken',
      encoding: 'o200k_base'
    },
    pricing: {
      inputPer1K: 0.15,
      outputPer1K: 0.6
    }
  },

  // Anthropic Models
  'claude-sonnet-4': {
    key: 'claude-sonnet-4',
    label: 'Claude Sonnet 4',
    contextWindow: 200000,
    tokenizerSpec: {
      type: 'anthropic',
      model: 'claude-3-5-sonnet-20241022'
    },
    pricing: {
      inputPer1K: 3.0,
      outputPer1K: 15.0
  },
  disabled: true
  },
  'claude-sonnet-3.7': {
    key: 'claude-sonnet-3.7',
    label: 'Claude Sonnet 3.7',
    contextWindow: 200000,
    tokenizerSpec: {
      type: 'anthropic',
      model: 'claude-3-5-sonnet-20241022'
    },
    pricing: {
      inputPer1K: 3.0,
      outputPer1K: 15.0
  },
  disabled: true
  },
  'claude-haiku-3.5': {
    key: 'claude-haiku-3.5',
    label: 'Claude Haiku 3.5',
    contextWindow: 200000,
    tokenizerSpec: {
      type: 'anthropic',
      model: 'claude-3-5-haiku-20241022'
    },
    pricing: {
      inputPer1K: 0.8,
      outputPer1K: 4.0
  },
  disabled: true
  },
  'claude-opus-4.1': {
    key: 'claude-opus-4.1',
    label: 'Claude Opus 4.1',
    contextWindow: 200000,
    tokenizerSpec: {
      type: 'anthropic',
      model: 'claude-3-opus-20240229'
    },
    pricing: {
      inputPer1K: 15.0,
      outputPer1K: 75.0
  },
  disabled: true
  },

  // Google Models
  'gemini-2.5-flash': {
    key: 'gemini-2.5-flash',
    label: 'Gemini 2.5 Flash',
    contextWindow: 1000000,
    tokenizerSpec: {
      type: 'gemini',
      model: 'gemini-2.5-flash'
    },
    pricing: {
      inputPer1K: 0.3,
      outputPer1K: 1.2
  },
  disabled: true
  },

  // xAI Models
  'grok-4': {
    key: 'grok-4',
    label: 'Grok 4',
    contextWindow: 128000,
    tokenizerSpec: {
      type: 'api-based',
      model: 'grok-4'
    },
    pricing: {
      inputPer1K: 3.0,
      outputPer1K: 15.0
  },
  disabled: true
  },

  // Perplexity Models

  // Cohere Models
  'command-r-plus': {
    key: 'command-r-plus',
    label: 'Command R+',
    contextWindow: 128000,
    tokenizerSpec: {
      type: 'cohere',
      model: 'command-r-plus'
    },
    pricing: {
      inputPer1K: 3.0,
      outputPer1K: 15.0
  },
  disabled: true
  },

  // Mistral Models
  // Note: These models use the HuggingFace tokenizer adapter with the Mistral 7B tokenizer.
  // The Mistral tokenizer is compatible across the entire Mistral model family.
  'mistral-large': {
    key: 'mistral-large',
    label: 'Mistral Large',
    contextWindow: 128000,
    tokenizerSpec: {
      type: 'hf-tokenizers',
      tokenizerPath: 'tokenizers/mistral.json'
    },
    pricing: {
      inputPer1K: 2.0,
      outputPer1K: 10.0
    }
  },
  'mistral-small': {
    key: 'mistral-small',
    label: 'Mistral Small',
    contextWindow: 128000,
    tokenizerSpec: {
      type: 'hf-tokenizers',
      tokenizerPath: 'tokenizers/mistral.json'
    },
    pricing: {
      inputPer1K: 1.0,
      outputPer1K: 5.0
    }
  },
  'mistral-7b': {
    key: 'mistral-7b',
    label: 'Mistral 7B Instruct',
    contextWindow: 32768,
    tokenizerSpec: {
      type: 'hf-tokenizers',
      tokenizerPath: 'tokenizers/mistral.json'
    },
    pricing: {
      inputPer1K: 0.25,
      outputPer1K: 0.25
    }
  },

  // Meta Llama Models
  // Note: These models use Qwen tokenizer as temporary fallback (no official Llama tokenizer available)
  'llama-3.1-405b': {
    key: 'llama-3.1-405b',
    label: 'Llama 3.1 405B Instruct (~temp)',
    contextWindow: 128000,
    tokenizerSpec: {
      type: 'hf-tokenizers',
      tokenizerPath: 'tokenizers/qwen.json'
  }
  },
  'llama-3.1-70b': {
    key: 'llama-3.1-70b',
    label: 'Llama 3.1 70B Instruct (~temp)',
    contextWindow: 128000,
    tokenizerSpec: {
      type: 'hf-tokenizers',
      tokenizerPath: 'tokenizers/qwen.json'
  }
  },
  'llama-3.1-8b': {
    key: 'llama-3.1-8b',
    label: 'Llama 3.1 8B Instruct (~temp)',
    contextWindow: 128000,
    tokenizerSpec: {
      type: 'hf-tokenizers',
      tokenizerPath: 'tokenizers/qwen.json'
  }
  },

  // Alibaba Qwen Models
  'qwen-2.5-72b': {
    key: 'qwen-2.5-72b',
    label: 'Qwen 2.5 72B Instruct',
    contextWindow: 131072,
    tokenizerSpec: {
      type: 'hf-tokenizers',
      tokenizerPath: 'tokenizers/qwen.json'
    }
  },

  // Microsoft Phi Models
  'phi-3.5-mini': {
    key: 'phi-3.5-mini',
    label: 'Phi-3.5-mini-instruct',
    contextWindow: 128000,
    tokenizerSpec: {
      type: 'hf-tokenizers',
      tokenizerPath: 'tokenizers/phi-3.5.json'
    }
  },

  // DeepSeek Models
  'deepseek-v3': {
    key: 'deepseek-v3',
    label: 'DeepSeek V3 (Chat)',
    contextWindow: 64000,
    tokenizerSpec: {
      type: 'hf-tokenizers',
      tokenizerPath: 'tokenizers/deepseek-v3.json'
    }
  },
  'deepseek-r1': {
    key: 'deepseek-r1',
    label: 'DeepSeek R1 (Reasoner)',
    contextWindow: 64000,
    tokenizerSpec: {
      type: 'hf-tokenizers',
      tokenizerPath: 'tokenizers/deepseek-r1.json'
    }
  },

  // Legacy models for backward compatibility
  'llama-3-8b': {
    key: 'llama-3-8b',
    label: 'Llama 3 8B (~temp)',
    contextWindow: 8192,
    tokenizerSpec: {
      type: 'hf-tokenizers',
      tokenizerPath: 'tokenizers/qwen.json'
  }
  },
  'claude-3-haiku': {
    key: 'claude-3-haiku',
    label: 'Claude 3 Haiku',
    contextWindow: 200000,
    tokenizerSpec: {
      type: 'anthropic',
      model: 'claude-3-haiku-20240307'
    },
    pricing: {
      inputPer1K: 0.25,
      outputPer1K: 1.25
  },
  disabled: true
  }
}

export function getModelInfo(key: string): ModelInfo | undefined {
  return MODEL_REGISTRY[key]
}

export function getAllModels(): ModelInfo[] {
  return Object.values(MODEL_REGISTRY)
}

export function getModelsByFamily(family: string): ModelInfo[] {
  return Object.values(MODEL_REGISTRY).filter(model => 
    model.key.startsWith(family.toLowerCase())
  )
}

export function getExampleModels(): ModelInfo[] { return [] }
export function getDefaultExampleModel(): ModelInfo { throw new Error('No example model defined') }
