import { getPricingInfo, calculateCost, formatCurrency } from '../lib/pricingData'
import type { ModelInfo } from '../modelRegistry'

interface CostCalculatorProps {
  tokenCount: number
  model: ModelInfo
}

export function CostCalculator({ tokenCount, model }: CostCalculatorProps) {
  const pricingInfo = getPricingInfo(model.key)
  
  if (!pricingInfo || (!pricingInfo.inputPricePer1M && !pricingInfo.inputCachedPricePer1M)) {
    return null
  }

  const regularCost = pricingInfo.inputPricePer1M 
    ? calculateCost(tokenCount, pricingInfo.inputPricePer1M)
    : null
    
  const cachedCost = pricingInfo.inputCachedPricePer1M 
    ? calculateCost(tokenCount, pricingInfo.inputCachedPricePer1M)
    : null

  const providerColors = {
    'OpenAI': 'linear-gradient(135deg, #10b981, #059669)',
    'Anthropic': 'linear-gradient(135deg, #f97316, #dc2626)', 
    'Google': 'linear-gradient(135deg, #3b82f6, #4f46e5)',
    'xAI': 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
    'Perplexity': 'linear-gradient(135deg, #06b6d4, #3b82f6)',
    'Cohere': 'linear-gradient(135deg, #ec4899, #f43f5e)',
    'Mistral': 'linear-gradient(135deg, #f59e0b, #f97316)',
    'Meta': 'linear-gradient(135deg, #2563eb, #8b5cf6)',
    'Alibaba': 'linear-gradient(135deg, #ef4444, #ec4899)',
    'Microsoft': 'linear-gradient(135deg, #3b82f6, #06b6d4)',
    'DeepSeek': 'linear-gradient(135deg, #4b5563, #64748b)'
  }

  const gradientStyle = providerColors[pricingInfo.provider as keyof typeof providerColors] || 'linear-gradient(135deg, #6b7280, #4b5563)'

  return (
    <div className="cost-calculator">
      <div className="cost-header" style={{ background: gradientStyle }}>
        <div className="cost-provider">{pricingInfo.provider}</div>
        <div className="cost-model">{pricingInfo.model}</div>
      </div>
      
      <div className="cost-content">
        {regularCost !== null && (
          <div className="cost-section">
            <div className="cost-label">
              <span className="cost-type">Input Cost</span>
              <span className="cost-rate">${pricingInfo.inputPricePer1M}/1M tokens</span>
            </div>
            <div className="cost-value">{formatCurrency(regularCost)}</div>
          </div>
        )}
        
        {cachedCost !== null && (
          <div className="cost-section cost-cached">
            <div className="cost-label">
              <span className="cost-type">Cached Cost</span>
              <span className="cost-rate">${pricingInfo.inputCachedPricePer1M}/1M tokens</span>
            </div>
            <div className="cost-value cost-value-cached">{formatCurrency(cachedCost)}</div>
          </div>
        )}
        
        <div className="cost-tokens">
          <span className="cost-tokens-count">{tokenCount.toLocaleString()}</span>
          <span className="cost-tokens-label">tokens</span>
        </div>
      </div>
    </div>
  )
}
