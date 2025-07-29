"use client"
import React, { useState, useEffect } from "react"
import CRTAnimation from "./CRTAnimation"

export default function MobileDisabled() {
  const [showError, setShowError] = useState(false)
  const [showTyping, setShowTyping] = useState(false)
  const [showRequirements, setShowRequirements] = useState(false)
  const [typedMessages, setTypedMessages] = useState([])
  const [currentTyping, setCurrentTyping] = useState("")

  const messages = [
    "It is pitch black...",
    "Your mobile device cannot navigate the darkness.",
    "The grue feeds on touch screens and small keyboards."
  ]

  useEffect(() => {
    // Show error message first
    const errorTimer = setTimeout(() => {
      setShowError(true)
    }, 500)

    // Start typing effect
    const typingTimer = setTimeout(() => {
      setShowTyping(true)
      startTyping()
    }, 2000)

    return () => {
      clearTimeout(errorTimer)
      clearTimeout(typingTimer)
    }
  }, [])

  const startTyping = () => {
    let messageIndex = 0
    let charIndex = 0

    const typeMessage = () => {
      if (messageIndex >= messages.length) {
        // All messages typed, show requirements after a delay
        setTimeout(() => {
          setShowRequirements(true)
        }, 500)
        return
      }

      const currentMessage = messages[messageIndex]
      
      if (charIndex <= currentMessage.length) {
        setCurrentTyping(currentMessage.slice(0, charIndex))
        charIndex++
        setTimeout(typeMessage, 50) // Typing speed
      } else {
        setTypedMessages(prev => [...prev, currentMessage])
        setCurrentTyping("")
        messageIndex++
        charIndex = 0
        setTimeout(typeMessage, 300) // Pause between messages
      }
    }

    typeMessage()
  }

  return (
    <div className="relative min-h-screen text-white" 
    style={{ minHeight: '100vh', minHeight: '100dvh' }}>
      <div className="crt-animation" 
      style={{ 
        position: 'fixed', 
        top: 0, left: 0, 
        width: '100%', 
        height: '100%', 
        minHeight: '100vh', 
        minHeight: '100dvh' 
        }}>
        <CRTAnimation/>
      </div>

      <div className="cli-container" 
      style={{ 
        position: 'relative', 
        zIndex: 2, 
        minHeight: '100vh', 
        minHeight: '100dvh',
        }}>
        <div className="flex items-center justify-center min-h-screen text-white font-mono">
          <div className="w-full max-w-4xl p-6">
            <div className="text-center">
              
              {showError && (
                <div className="ascii-text fade-in text-2xl mb-6">
                  <span className="text-red-500">ERROR:</span> 
                    <span className="text-white">Incompatible terminal detected</span>
                </div>
              )}
              
              {showTyping && (
                <div className="text-left text-xl max-w-2xl mx-auto mb-8">
                  {typedMessages.map((message, index) => (
                    <div key={index} className="mb-4">{message}</div>
                  ))}
                  {currentTyping && <div className="mb-4">{currentTyping}</div>}
                </div>
              )}
              
              {showRequirements && (
                <>
                  <div className="text-left text-lg max-w-2xl mx-auto border border-gray-600">
                    <div className="bg-gray-900/80 p-6">
                      <div className="text-green-400 mb-4">SYSTEM REQUIREMENTS:</div>
                      <div className="mb-2">■ Desktop or laptop computer</div>
                      <div className="mb-2">■ Physical keyboard required</div>
                      <div className="mb-2">■ Screen width: minimum 1024px</div>
                      
                      <div className="text-yellow-400 mt-6">
                        <div>Please return with proper equipment to survive the grue.</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-500 mt-8">
                    ~ Terminal session terminated ~
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
