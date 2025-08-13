export interface PricingInfo {
  provider: string
  model: string
  tokenizer: string
  inputPricePer1M: number | null
  inputCachedPricePer1M: number | null
  priceSource: string
}

// Pricing data extracted from llmsTokenizer.csv
export const PRICING_DATA: Record<string, PricingInfo> = {
  'gpt-4o': {
    provider: 'OpenAI',
    model: 'gpt-4o',
    tokenizer: 'tiktoken (o200k_base)',
    inputPricePer1M: 2.5,
    inputCachedPricePer1M: 1.25,
    priceSource: 'OpenAI pricing + prompt caching'
  },
  'gpt-4o-mini': {
    provider: 'OpenAI',
    model: 'gpt-4o-mini',
    tokenizer: 'tiktoken (o200k_base)',
    inputPricePer1M: 0.15,
    inputCachedPricePer1M: 0.075,
    priceSource: 'OpenAI pricing + prompt caching'
  },
  'claude-sonnet-4': {
    provider: 'Anthropic',
    model: 'Claude Sonnet 4',
    tokenizer: 'Anthropic SDK (count_tokens)',
    inputPricePer1M: 3.0,
    inputCachedPricePer1M: 0.3,
    priceSource: 'Anthropic pricing (prompt caching multipliers)'
  },
  'claude-sonnet-3.7': {
    provider: 'Anthropic',
    model: 'Claude Sonnet 3.7',
    tokenizer: 'Anthropic SDK (count_tokens)',
    inputPricePer1M: 3.0,
    inputCachedPricePer1M: 0.3,
    priceSource: 'Anthropic pricing (prompt caching multipliers)'
  },
  'claude-haiku-3.5': {
    provider: 'Anthropic',
    model: 'Claude Haiku 3.5',
    tokenizer: 'Anthropic SDK (count_tokens)',
    inputPricePer1M: 0.8,
    inputCachedPricePer1M: 0.08,
    priceSource: 'Anthropic pricing (prompt caching multipliers)'
  },
  'claude-opus-4.1': {
    provider: 'Anthropic',
    model: 'Claude Opus 4.1',
    tokenizer: 'Anthropic SDK (count_tokens)',
    inputPricePer1M: 15.0,
    inputCachedPricePer1M: 1.5,
    priceSource: 'Anthropic pricing (prompt caching multipliers)'
  },
  'gemini-2.5-flash': {
    provider: 'Google',
    model: 'Gemini 2.5 Flash',
    tokenizer: 'google-generativeai SDK (count_tokens)',
    inputPricePer1M: 0.3,
    inputCachedPricePer1M: 0.3125,
    priceSource: 'OpenRouter model page + Gemini pricing'
  },
  'grok-4': {
    provider: 'xAI',
    model: 'Grok 4',
    tokenizer: 'API usage (no public tokenizer)',
    inputPricePer1M: 3.0,
    inputCachedPricePer1M: 0.75,
    priceSource: 'OpenRouter model page + OR caching doc'
  },
  'sonar-pro': {
    provider: 'Perplexity',
    model: 'Sonar Pro',
    tokenizer: 'API usage (varies by underlying model)',
    inputPricePer1M: 3.0,
    inputCachedPricePer1M: null,
    priceSource: 'Perplexity pricing page'
  },
  'sonar-reasoning-pro': {
    provider: 'Perplexity',
    model: 'Sonar Reasoning Pro',
    tokenizer: 'API usage (DeepSeek-based)',
    inputPricePer1M: 2.0,
    inputCachedPricePer1M: null,
    priceSource: 'Perplexity pricing page'
  },
  'sonar': {
    provider: 'Perplexity',
    model: 'Sonar',
    tokenizer: 'API usage',
    inputPricePer1M: 1.0,
    inputCachedPricePer1M: null,
    priceSource: 'Perplexity pricing page'
  },
  'command-r-plus': {
    provider: 'Cohere',
    model: 'Command R+',
    tokenizer: 'cohere SDK (token counting in API)',
    inputPricePer1M: 3.0,
    inputCachedPricePer1M: null,
    priceSource: 'OpenRouter model page'
  },
  'mistral-large': {
    provider: 'Mistral',
    model: 'Mistral Large (latest)',
    tokenizer: 'mistral-common (SentencePiece)',
    inputPricePer1M: null,
    inputCachedPricePer1M: null,
    priceSource: '—'
  },
  'mistral-small': {
    provider: 'Mistral',
    model: 'Mistral Small (latest)',
    tokenizer: 'mistral-common (SentencePiece)',
    inputPricePer1M: null,
    inputCachedPricePer1M: null,
    priceSource: '—'
  },
  'llama-3.1-405b': {
    provider: 'Meta',
    model: 'Llama 3.1 405B Instruct',
    tokenizer: 'TikTokenizer / tiktoken-based (Llama3)',
    inputPricePer1M: null,
    inputCachedPricePer1M: null,
    priceSource: '—'
  },
  'llama-3.1-70b': {
    provider: 'Meta',
    model: 'Llama 3.1 70B Instruct',
    tokenizer: 'TikTokenizer / tiktoken-based (Llama3)',
    inputPricePer1M: null,
    inputCachedPricePer1M: null,
    priceSource: '—'
  },
  'llama-3.1-8b': {
    provider: 'Meta',
    model: 'Llama 3.1 8B Instruct',
    tokenizer: 'TikTokenizer / tiktoken-based (Llama3)',
    inputPricePer1M: null,
    inputCachedPricePer1M: null,
    priceSource: '—'
  },
  'qwen-2.5-72b': {
    provider: 'Alibaba',
    model: 'Qwen 2.5 72B Instruct',
    tokenizer: 'SentencePiece (HF AutoTokenizer)',
    inputPricePer1M: null,
    inputCachedPricePer1M: null,
    priceSource: '—'
  },
  'phi-3.5-mini': {
    provider: 'Microsoft',
    model: 'Phi-3.5-mini-instruct',
    tokenizer: 'SentencePiece (HF AutoTokenizer)',
    inputPricePer1M: null,
    inputCachedPricePer1M: null,
    priceSource: '—'
  },
  'deepseek-v3': {
    provider: 'DeepSeek',
    model: 'DeepSeek V3 (Chat)',
    tokenizer: 'HF Tokenizers / deepseek_tokenizer',
    inputPricePer1M: null,
    inputCachedPricePer1M: 0.07,
    priceSource: 'DeepSeek docs (cache reads)'
  },
  'deepseek-r1': {
    provider: 'DeepSeek',
    model: 'DeepSeek R1 (Reasoner)',
    tokenizer: 'HF Tokenizers / deepseek_tokenizer',
    inputPricePer1M: null,
    inputCachedPricePer1M: 0.14,
    priceSource: 'DeepSeek docs (cache reads)'
  }
}

export function getPricingInfo(modelKey: string): PricingInfo | null {
  return PRICING_DATA[modelKey] || null
}

export function calculateCost(tokens: number, pricePer1M: number): number {
  return (tokens / 1_000_000) * pricePer1M
}

export function formatCurrency(amount: number): string {
  if (amount < 0.001) {
    return `$${(amount).toFixed(6)}`
  }
  if (amount < 0.01) {
    return `$${amount.toFixed(4)}`
  }
  if (amount < 1) {
    return `$${amount.toFixed(3)}`
  }
  return `$${amount.toFixed(2)}`
}
