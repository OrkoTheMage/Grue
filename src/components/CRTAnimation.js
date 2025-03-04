"use client"
import React, { useEffect, useState } from 'react'
import './CRTAnimation.css'

const CRTAnimation = () => {
  const [linePosition, setLinePosition] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setLinePosition(prev => {
        // If the line has reached the bottom of the screen, reset to the top
        if (prev >= window.innerHeight) {
          return 0  // Reset back to the top
        }
        return prev + 1  // Move down by 1 pixel per frame
      })
    }, 16) // This updates every frame (~60FPS)

    return () => clearInterval(interval) // Clean up interval on unmount
  }, [])

  // Random opacity change, now more spaced out
  const randomOpacity = Math.random() * 0.1 + 0.85 // Random opacity between 0.85 and 0.95

  return (
    <div className="crt-container">
      <div className="crt-lines"></div>
      <div
        className="crt-h-line"
        style={{
          top: `${linePosition}px`,
          opacity: randomOpacity, // Apply random opacity to create a subtle flicker
        }}
      />
    </div>
  )
}

export default CRTAnimation
