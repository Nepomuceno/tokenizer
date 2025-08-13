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
  'command-r-plus': {
    provider: 'Cohere',
    model: 'Command R+',
    tokenizer: 'cohere SDK (token counting in API)',
    inputPricePer1M: 3.0,
    inputCachedPricePer1M: null,
    priceSource: 'OpenRouter model page'
  },
  // Mistral pricing (mirrors modelRegistry placeholder rates; adjust with authoritative source if available)
  'mistral-large': {
    provider: 'Mistral',
    model: 'Mistral Large',
    tokenizer: 'mistral-common (SentencePiece)',
    inputPricePer1M: 2.0, // placeholder per 1M tokens
    inputCachedPricePer1M: 1.0, // simple 50% cached assumption
    priceSource: 'Provisional (update with official public pricing)'
  },
  'mistral-small': {
    provider: 'Mistral',
    model: 'Mistral Small',
    tokenizer: 'mistral-common (SentencePiece)',
    inputPricePer1M: 1.0,
    inputCachedPricePer1M: 0.5,
    priceSource: 'Provisional (update with official public pricing)'
  },
  'mistral-7b': {
    provider: 'Mistral',
    model: 'Mistral 7B Instruct',
    tokenizer: 'mistral-common (SentencePiece)',
    inputPricePer1M: 0.25,
    inputCachedPricePer1M: 0.125,
    priceSource: 'Provisional (community / self-host baseline)'
  },
  // Open source / OSS style models (provisional self-host baseline pricing). These are placeholders so UI shows cost fields.
  'llama-3.1-405b': {
    provider: 'Meta',
    model: 'Llama 3.1 405B Instruct',
    tokenizer: 'Qwen tokenizer (temporary)',
    inputPricePer1M: 0,
    inputCachedPricePer1M: null,
    priceSource: 'Open source (self-host); compute cost not included'
  },
  'llama-3.1-70b': {
    provider: 'Meta',
    model: 'Llama 3.1 70B Instruct',
    tokenizer: 'Qwen tokenizer (temporary)',
    inputPricePer1M: 0,
    inputCachedPricePer1M: null,
    priceSource: 'Open source (self-host); compute cost not included'
  },
  'llama-3.1-8b': {
    provider: 'Meta',
    model: 'Llama 3.1 8B Instruct',
    tokenizer: 'Qwen tokenizer (temporary)',
    inputPricePer1M: 0,
    inputCachedPricePer1M: null,
    priceSource: 'Open source (self-host); compute cost not included'
  },
  'llama-3-8b': {
    provider: 'Meta',
    model: 'Llama 3 8B',
    tokenizer: 'Qwen tokenizer (temporary)',
    inputPricePer1M: 0,
    inputCachedPricePer1M: null,
    priceSource: 'Open source (self-host); compute cost not included'
  },
  'qwen-2.5-72b': {
    provider: 'Alibaba',
    model: 'Qwen 2.5 72B Instruct',
    tokenizer: 'SentencePiece (HF AutoTokenizer)',
  // Assumption: Similar tier to other large frontier OSS models when served via API ≈ $0.6 / 1M input
  // (If self-hosting cost is zero in UI user can override; we surface a nominal reference value.)
  inputPricePer1M: 0.6,
  inputCachedPricePer1M: 0.3, // assume 50% for cached reads
  priceSource: 'Assumed (approx large OSS model rate; adjust with official Qwen API pricing)'
  },
  'phi-3.5-mini': {
    provider: 'Microsoft',
    model: 'Phi-3.5-mini-instruct',
    tokenizer: 'SentencePiece (HF AutoTokenizer)',
  // Assumption: Smaller efficient model; cheaper than Mistral Small; set at $0.1 / 1M
  inputPricePer1M: 0.1,
  inputCachedPricePer1M: 0.05,
  priceSource: 'Assumed (lightweight model baseline)'
  },
  'deepseek-v3': {
    provider: 'DeepSeek',
    model: 'DeepSeek V3 (Chat)',
    tokenizer: 'HF Tokenizers / deepseek_tokenizer',
  // Assumption: Competitive with gpt-4o-mini tier for input; set at $0.18 / 1M
  inputPricePer1M: 0.18,
  inputCachedPricePer1M: 0.07, // keep documented cache read estimate
  priceSource: 'Assumed input; cached from DeepSeek docs'
  },
  'deepseek-r1': {
    provider: 'DeepSeek',
    model: 'DeepSeek R1 (Reasoner)',
    tokenizer: 'HF Tokenizers / deepseek_tokenizer',
  // Assumption: Reasoning premium over V3 (~2x mini tier) => $0.36 / 1M
  inputPricePer1M: 0.36,
  inputCachedPricePer1M: 0.14,
  priceSource: 'Assumed input; cached from DeepSeek docs'
  },
  'claude-3-haiku': {
    provider: 'Anthropic',
    model: 'Claude 3 Haiku',
    tokenizer: 'Anthropic SDK (count_tokens)',
    inputPricePer1M: 0.25,
    inputCachedPricePer1M: 0.025,
    priceSource: 'Anthropic pricing (prompt caching multipliers)'
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
