import React from 'react'
import { getDiscoveredSecrets, recordDiscoveredSecret } from "./auth"

export const clearLogs = (setLogs, setInput) => {
  setLogs([])
  setInput("")
}

export const animateDotsWithMessage = (message, maxDots, setLogs, callback) => {
  let dotCount = 0
  
  let initialLogPosition = null
  
  const animate = () => {
    const dotsMessage = `${message}${'.'.repeat(dotCount + 1)}`
    
    if (initialLogPosition === null) {
      setLogs(prev => {
        initialLogPosition = prev.length
        return [...prev, dotsMessage]
      })
    } else {
      setLogs(prev => {
        const newLogs = [...prev]
        newLogs[initialLogPosition] = dotsMessage
        return newLogs
      })
    }
    
    if (dotCount < maxDots - 1) {
      dotCount++
      setTimeout(animate, 500)
    } else {
      setLogs(prev => {
        const newLogs = [...prev]
        newLogs.splice(initialLogPosition, 1)
        return newLogs
      })
      
      callback()
    }
  }
  
  animate()
}

export const createIframe = (key, src, title) => {
  return (
    <div key={key} className="game-container relative">
      <iframe
        id={`iframe-${key}`}
        src={src}
        width="100%"
        height="900px"
        title={title}
        allow="fullscreen"
        frameBorder="0"
      ></iframe>
      <button
        className="fullscreen-btn absolute top-2 right-2 bg-gray-800 text-white px-3 py-1 rounded hover:bg-gray-700"
        title="Fullscreen"
        onClick={() => {
          const iframe = document.getElementById(`iframe-${key}`)
          if (iframe.requestFullscreen) {
            iframe.requestFullscreen()
          } else if (iframe.mozRequestFullScreen) {
            iframe.mozRequestFullScreen()
          } else if (iframe.webkitRequestFullscreen) {
            iframe.webkitRequestFullscreen()
          } else if (iframe.msRequestFullscreen) {
            iframe.msRequestFullscreen()
          }
        }}
      >
        ⛶
      </button>
    </div>
  )
}

export const exitCli = (setLogs, setInput, setCurrentUser, currentUser) => {
  if (!currentUser) {
    setLogs(prev => [...prev, "You are not currently logged in."])
    return
  }

  animateDotsWithMessage("Logging out", 4, setLogs, () => {
    setCurrentUser(null)
    setInput("")
    setLogs(prev => [
      ...prev,
      "Logged out successfully."
    ])

    animateDotsWithMessage("Restarting", 6, setLogs, () => {
      window.location.reload()
    })
  })
}

export const generatePrompt = (currentUser) => {
  return currentUser 
    ? <span className="text-green-400">{`${currentUser}@system:`}</span>
    : <span className="text-green-400">system:</span>
}

export const loadUserSecrets = async (currentUser, setFoundSecrets) => {
  if (!currentUser) return
  
  const userSecrets = await getDiscoveredSecrets(currentUser)
  if (userSecrets) {
    setFoundSecrets(prev => ({
      ...prev,
      ...userSecrets
    }))
  }
}

export const secretDiscovered = async (currentUser, secretName, foundSecrets, setFoundSecrets, displayMsg) => {
  if (!currentUser) return false
  if (foundSecrets[secretName]) return false // Already found locally
  
  const result = await recordDiscoveredSecret(currentUser, secretName)
  
  if (result.success && !result.alreadyDiscovered) {
    setFoundSecrets(prev => ({...prev, [secretName]: true}))
    displayMsg(<span className="text-yellow-400">You found a secret!</span>)
    return true
  }
  
  return false
}