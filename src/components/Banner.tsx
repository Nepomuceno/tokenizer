import React from 'react'
import { TokenizerLogo } from './TokenizerLogo'
import { ThemeToggle } from './ThemeToggle'

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
          className="inline-block px-2 sm:px-3 md:px-4 py-1 sm:py-2 text-2xl sm:text-4xl md:text-5xl font-bold text-gray-800"
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
    <div className="relative">
      {/* Theme Toggle - positioned absolute on mobile, inline on desktop */}
      <div className="absolute top-0 right-0 sm:top-4 sm:right-4 z-10">
        <ThemeToggle />
      </div>
      
      <div className="flex flex-col sm:flex-row items-center justify-center w-full py-6 sm:py-8 mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 md:gap-10 px-4 sm:px-8 md:px-12 py-4 sm:py-6">
          <TokenizerLogo 
            className="flex-shrink-0" 
            width={80} 
            height={80}
          />
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <TokenizerText />
            <p className="text-sm sm:text-base md:text-lg text-[var(--tc-muted)] mt-2 sm:mt-4 font-medium max-w-xs sm:max-w-none">
              Count tokens, estimate cost, check context fit.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
