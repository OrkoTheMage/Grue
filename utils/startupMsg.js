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
    "■ Use 'ls' to list available files in a directory.",
    "■ Use 'cd <directory>' to change directories.",
    "■ Use 'run <game>' to launch a game.",
    "■ Please register or log in.",
    "■ Type 'help' for more information.",
  ]

  let currentIndex = 0

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
        setTimeout(callback, 300)
      }
    }, 50) // Typing speed
  }

  const typeNextMessage = () => {
    if (currentIndex < messages.length) {
      typeMessage(messages[currentIndex], () => {
        currentIndex++
        typeNextMessage()
      })
    } else {
      setLogs(prevLogs => [...prevLogs, ...finalMessages])

      setTimeout(() => {
        const asciiElement = document.querySelector('.ascii-text')
        if (asciiElement) {
          asciiElement.classList.add('fade-in')
        }
        
        // Call the completion callback after everything is done
        if (onComplete && typeof onComplete === 'function') {
          setTimeout(onComplete, 300)
        }
      }, 100) // Adding a slight delay to allow React to render
    }
  }

  return typeNextMessage
}
