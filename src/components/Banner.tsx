import React from 'react'
import { TokenizerLogo } from './TokenizerLogo'

const TokenizerText: React.FC = () => {
  const syllables = [
    { text: 'T', bg: '#a78bfa' },     // Purple
    { text: 'OKE', bg: '#34d399' },   // Green
    { text: 'NI', bg: '#fbbf24' },    // Yellow
    { text: 'ZER', bg: '#60a5fa' }    // Blue
  ]

  return (
    <div className="flex items-center -space-x-1">
      {syllables.map((syllable, index) => (
        <span
          key={index}
          className="inline-block px-4 py-2 text-5xl font-bold text-gray-800"
          style={{ backgroundColor: syllable.bg }}
        >
          {syllable.text}
        </span>
      ))}
    </div>
  )
}

export const Banner: React.FC = () => {
  return (
    <div className="flex items-center justify-center w-full py-8 mb-8">
      <div className="flex items-center gap-10 px-12 py-6">
        <TokenizerLogo className="flex-shrink-0" width={120} height={120} />
        <div className="flex flex-col items-start">
          <TokenizerText />
          <p className="text-lg text-gray-600 mt-4 font-medium">
            Count tokens, estimate cost, check context fit.
          </p>
        </div>
      </div>
    </div>
  )
}
