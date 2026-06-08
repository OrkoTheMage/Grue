// Utility functions for displaying startup messages
// This function displays an ASCII art message and additional instructions
// Used in the initial loading of the terminal

"use client"

const ascii = `
  ▄██████▄     ▄████████ ███    █▄     ▄████████ 
  ███    ███   ███    ███ ███    ███   ███    ███ 
  ███    █▀    ███    ███ ███    ███   ███    █▀  
 ▄███         ▄███▄▄▄▄██▀ ███    ███  ▄███▄▄▄     
▀▀███ ████▄  ▀▀███▀▀▀▀▀   ███    ███ ▀▀███▀▀▀     
  ███    ███ ▀███████████ ███    ███   ███    █▄  
  ███    ███   ███    ███ ███    ███   ███    ███ 
  ████████▀    ███    ███ ████████▀    ██████████ 
               ███    ███                         
`

export const startupMsg = (setLogs, onComplete) => {
  const messages = [
    "Welcome user,",
    "It is pitch black...",
    "You are likely to be eaten by a..."
  ]

  const finalMessages = [
    <div key="ascii" className="ascii-text">{ascii}</div>,
    "-------------------------------------------------",
    "■ Use 'ls' to list files and directories.",
    "■ Use 'cd <directory>' to navigate into a directory.",
    "■ Use 'open <file>' to open projects and links.",
    "■ Register or log in to track your stats.",
    "■ Type 'help' for a full list of commands.",
  ]

  let currentIndex = 0
  // Track every timer so we can cancel them all on cleanup
  const timers = []

  const typeMessage = (message, callback) => {
    let charIndex = 0

    setLogs(prevLogs => [...prevLogs, ""])

    const interval = setInterval(() => {
      setLogs(prevLogs => {
        let updatedLogs = [...prevLogs]
        updatedLogs[currentIndex] = message.slice(0, charIndex + 1)
        return updatedLogs
      })

      charIndex++

      if (charIndex === message.length) {
        clearInterval(interval)
        timers.splice(timers.indexOf(interval), 1)
        timers.push(setTimeout(callback, 300))
      }
    }, 50) // Typing speed
    timers.push(interval)
  }

  const typeNextMessage = () => {
    if (currentIndex < messages.length) {
      typeMessage(messages[currentIndex], () => {
        currentIndex++
        typeNextMessage()
      })
    } else {
      setLogs(prevLogs => [...prevLogs, ...finalMessages])

      timers.push(setTimeout(() => {
        const asciiElement = document.querySelector('.ascii-text')
        if (asciiElement) {
          asciiElement.classList.add('fade-in')
        }

        // Call the completion callback after everything is done
        if (onComplete && typeof onComplete === 'function') {
          timers.push(setTimeout(onComplete, 300))
        }
      }, 100))
    }
  }

  const cleanup = () => {
    timers.forEach(id => {
      clearInterval(id)
      clearTimeout(id)
    })
    timers.length = 0
  }

  return { start: typeNextMessage, cleanup }
}
