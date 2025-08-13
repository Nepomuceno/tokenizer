import React from 'react'

interface FileUploadIconProps {
  className?: string
  width?: number | string
  height?: number | string
}

export const FileUploadIcon: React.FC<FileUploadIconProps> = ({ 
  className = "", 
  width = "100%", 
  height = "100%" 
}) => (
  <svg 
    width={width}
    height={height}
    viewBox="0 0 24 24" 
    xmlns="http://www.w3.org/2000/svg" 
    role="img" 
    aria-labelledby="file-upload-icon-title" 
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <title id="file-upload-icon-title">Upload file icon</title>
    
    {/* Upload area */}
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
    
    {/* Upload arrow */}
    <polyline points="9,12 12,9 15,12"/>
    <line x1="12" y1="9" x2="12" y2="21"/>
    
    {/* File indication */}
    <path d="M16 6h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2"/>
  </svg>
)

export const FileProcessingIcon: React.FC<FileUploadIconProps> = ({ 
  className = "", 
  width = "100%", 
  height = "100%" 
}) => (
  <svg 
    width={width}
    height={height}
    viewBox="0 0 24 24" 
    xmlns="http://www.w3.org/2000/svg" 
    role="img" 
    aria-labelledby="file-processing-icon-title" 
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <title id="file-processing-icon-title">File processing icon</title>
    
    {/* Document outline */}
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    
    {/* Document corner fold */}
    <polyline points="14,2 14,8 20,8"/>
    
    {/* Processing spinner in center */}
    <circle cx="12" cy="13" r="3"/>
    <path d="M12 10v3l2 2"/>
  </svg>
)

export const FileIcon: React.FC<FileUploadIconProps> = ({ 
  className = "", 
  width = "100%", 
  height = "100%" 
}) => (
  <svg 
    width={width}
    height={height}
    viewBox="0 0 32 32" 
    xmlns="http://www.w3.org/2000/svg" 
    role="img" 
    aria-labelledby="file-icon-title" 
    className={className}
  >
    <title id="file-icon-title">File with colorful content blocks</title>
    
    {/* Document background */}
    <rect x="6" y="4" width="20" height="24" rx="2" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1"/>
    
    {/* Document corner fold */}
    <path d="M22 4v4h4" fill="none" stroke="#e2e8f0" strokeWidth="1"/>
    <path d="M22 4l4 4" stroke="#e2e8f0" strokeWidth="1"/>
    
    {/* Colorful content blocks to represent tokenized content */}
    <rect x="9" y="10" width="8" height="2" rx="1" fill="#a78bfa"/>
    <rect x="18" y="10" width="5" height="2" rx="1" fill="#34d399"/>
    
    <rect x="9" y="13" width="6" height="2" rx="1" fill="#fbbf24"/>
    <rect x="16" y="13" width="7" height="2" rx="1" fill="#60a5fa"/>
    
    <rect x="9" y="16" width="9" height="2" rx="1" fill="#f87171"/>
    <rect x="19" y="16" width="4" height="2" rx="1" fill="#c084fc"/>
    
    <rect x="9" y="19" width="5" height="2" rx="1" fill="#34d399"/>
    <rect x="15" y="19" width="8" height="2" rx="1" fill="#fbbf24"/>
    
    <rect x="9" y="22" width="7" height="2" rx="1" fill="#60a5fa"/>
    <rect x="17" y="22" width="6" height="2" rx="1" fill="#a78bfa"/>
  </svg>
)
