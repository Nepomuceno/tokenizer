import React from 'react'

interface TokenizerLogoProps {
  className?: string
  width?: number | string
  height?: number | string
}

export const TokenizerLogo: React.FC<TokenizerLogoProps> = ({ 
  className = "", 
  width = "100%", 
  height = "100%" 
}) => (
  <svg 
    width={width}
    height={height}
    viewBox="0 0 128 128" 
    xmlns="http://www.w3.org/2000/svg" 
    role="img" 
    aria-labelledby="tokenizer-logo-title" 
    className={className}
  >
    <title id="tokenizer-logo-title">Tokenizer blocks — compact with varied widths</title>

    {/* Container */}
    <rect x="6" y="10" width="116" height="108" rx="18"
          fill="none" stroke="#374151" strokeWidth="6"/>

    {/* Row 1 */}
    <rect x="16" y="20" width="16" height="17.5" rx="5" fill="#a78bfa"/>
    <rect x="33" y="20" width="26" height="17.5" rx="5" fill="#34d399"/>
    <rect x="61" y="20" width="14" height="17.5" rx="5" fill="#fbbf24"/>
    <rect x="77" y="20" width="34" height="17.5" rx="5" fill="#60a5fa"/>

    {/* Row 2 */}
    <rect x="16" y="43.5" width="30" height="17.5" rx="5" fill="#f87171"/>
    <rect x="47" y="43.5" width="14" height="17.5" rx="5" fill="#c084fc"/>
    <rect x="62" y="43.5" width="28" height="17.5" rx="5" fill="#34d399"/>
    <rect x="91" y="43.5" width="18" height="17.5" rx="5" fill="#fbbf24"/>

    {/* Row 3 */}
    <rect x="16" y="67" width="22" height="17.5" rx="5" fill="#60a5fa"/>
    <rect x="39" y="67" width="34" height="17.5" rx="5" fill="#fca5a5"/>
    <rect x="74.5" y="67" width="12" height="17.5" rx="5" fill="#a78bfa"/>
    <rect x="88" y="67" width="22" height="17.5" rx="5" fill="#34d399"/>

    {/* Row 4 */}
    <rect x="16" y="90.5" width="14" height="17.5" rx="5" fill="#c084fc"/>
    <rect x="31" y="90.5" width="30" height="17.5" rx="5" fill="#60a5fa"/>
    <rect x="62" y="90.5" width="18" height="17.5" rx="5" fill="#f87171"/>
    <rect x="81" y="90.5" width="28" height="17.5" rx="5" fill="#fbbf24"/>
  </svg>
)
