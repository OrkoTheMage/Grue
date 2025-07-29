// Utility functions for CLI interactions
// These functions handle common CLI tasks like clearing logs, animating messages, creating iframes
// Used in CLI components

import React from 'react'
import { getDiscoveredSecrets, getUserStatistics, recordDiscoveredSecret } from "./auth"

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

export const exitCli = (setLogs) => {
setTimeout(() => {
    animateDotsWithMessage("Restarting", 6, setLogs, () => {
      window.location.reload()
    })
  }, 2000)
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
    if (secretName === "help") {
      displayMsg(<span className="text-yellow-300">You found a secret! - Try finding more!</span>)
    } else {
      displayMsg(<span className="text-yellow-300">You found a secret!</span>)
    }
    return true
  }
  
  return false
}

export const stats = (currentUser, displayMsg, setLogs) => {
  !currentUser 
    ? displayMsg("You must be logged in to view your stats.")
    : animateDotsWithMessage("Retrieving your stats", 4, setLogs, () => {
        getUserStatistics(currentUser, displayMsg).then(stats => {
          stats && (
            displayMsg(<span className="text-blue-500">Your Statistics:</span>),
            displayMsg(`-------------------------------------------------`),
            displayMsg(`Dice Rolled: ${stats.diceRolled || 0}`),
            displayMsg(`Magic 8-Ball Used: ${stats.magic8ballUsed || 0}`),
            displayMsg(`Coins Flipped: ${stats.coinsFlipped || 0}`),
            displayMsg(`Games Played: ${stats.gamesPlayed || 0}`),
            displayMsg(`Secrets Found: ${stats.secretsFound || 0}`)
          )
        })
      })
}

export const ps = (startTime, displayMsg) => {
  displayMsg(<span className="text-blue-500">PID   TTY    TIME    CMD</span>)
  displayMsg("----------------------------")
  if (startTime) {
    const uptime = new Date(new Date() - startTime)
    const hours = uptime.getUTCHours().toString().padStart(2, '0')
    const minutes = uptime.getUTCMinutes().toString().padStart(2, '0')
    const seconds = uptime.getUTCSeconds().toString().padStart(2, '0')
    const uptimeFormatted = `${hours}:${minutes}:${seconds}`
    displayMsg(`1337 pts/0 ${uptimeFormatted} grue.sh`)
    displayMsg(`1338 pts/1 ${uptimeFormatted} notAVirus.exe`)
  } else {
    displayMsg("No processes found")
  }
}

export const kill = (args, displayMsg, setLogs) => {
  args.length === 0
    ? displayMsg("Usage: kill <PID>")
    : args[0] === "1337"
    ? (
      displayMsg(<span className="text-red-500">You cannot kill the grue.</span>),
      displayMsg(<>{`The grue is `}<span className="text-red-500">eternal</span></>),
      displayMsg(<>{`the grue is `}<span className="text-red-500">infinite</span></>),
      displayMsg("the grue is..."),
      displayMsg(<span className="text-red-500">hungry</span>),
      displayMsg("You are eaten by the grue."),
      exitCli(setLogs)       
      )
    : args[0] === "1338"
    ? displayMsg(<span className="text-red-500">You cannot kill the virus. This is not a bug, it's a feature.</span>)
    : displayMsg(`No process found with PID ${args[0]}`)
}

export const getGreetings = () => [
  "Hey there! Roll a dice, flip a coin, or ask the magic8ball!",
  "Hello, adventurer! Want to try your luck with a dice roll?",
  "Yo! Will it be heads or tails in your coin flip?",
  "Howdy! Say the secret word 'xyzzy' for a surprise!",
  "Ah, brave traveler, you've arrived. What's your next move?",
  "Greetings, wanderer! What adventure shall we embark on today?",
  "Hello, hero! The world awaits — what will you do now?",
  "Hey, adventurer! The journey is yours to shape — what's next?",
  "Welcome, traveler! Ready to explore the unknown?",
  "Ah, a new face! What's your first quest on this fine day?"
]

export const getMagic8BallResponses = () => [
  "It is certain.",
  "It is decidedly so.",
  "Without a doubt.",
  "Yes - definitely.",
  "You may rely on it.",
  "As I see it, yes.",
  "Most likely.",
  "Outlook good.",
  "Yes.",
  "Signs point to yes.",
  "Reply hazy, try again.",
  "Ask again later.",
  "Better not tell you now.",
  "Cannot predict now.",
  "Concentrate and ask again.",
  "Don't count on it.",
  "My reply is no.",
  "My sources say no.",
  "Outlook not so good.",
  "Very doubtful."
]
