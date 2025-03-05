"use client"
import React, { useEffect, useState } from 'react'
import '../styles/CRTAnimation.css'

const CRTAnimation = () => {
  const [linePosition, setLinePosition] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setLinePosition(prev => {
        if (prev >= window.innerHeight) {
          return 0
        }
        return prev + 1
      })
    }, 16)

    return () => clearInterval(interval)
  }, [])


  return (
    <div className="crt-container">
      <div className="crt-lines"></div>
      <div
        className="crt-h-line"
        style={{
          top: `${linePosition}px`,
        }}
      />
    </div>
  )
}

export default CRTAnimation