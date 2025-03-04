"use client"
import { useEffect, useRef, useState } from "react"


export default function CLI() {
  const [input, setInput] = useState("")
  const [logs, setLogs] = useState([])
  const [users, setUsers] = useState([])
  const [commandHistory, setCommandHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [currentUser, setCurrentUser] = useState(null)
  const [currentDir, setCurrentDir] = useState("/") // To track the current directory

  const KEY_ENTER = "Enter"
  const KEY_ARROW_UP = "ArrowUp"
  const KEY_ARROW_DOWN = "ArrowDown"

  const logsEndRef = useRef(null)  // Create a ref to track the end of the logs
  const hasRun = useRef(false)

  useEffect(() => {
    if (!hasRun.current) {
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
  
      let currentIndex = 0 // Track which message we're typing
  
      const typeMessage = (message, callback) => {
        let charIndex = 0
  
        setLogs(prevLogs => [...prevLogs, ""]) // Add an empty line for the new message
  
        const interval = setInterval(() => {
          setLogs(prevLogs => {
            let updatedLogs = [...prevLogs]
            updatedLogs[currentIndex] = message.slice(0, charIndex + 1) // Slice the string instead of appending
            return updatedLogs
          })
  
          charIndex++
  
          if (charIndex === message.length) {
            clearInterval(interval)
            setTimeout(callback, 300) // Wait 1.5s before typing the next message
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
          // Append final messages at once
          setLogs(prevLogs => [...prevLogs, ...finalMessages])
        }
      }
  
      typeNextMessage()
      hasRun.current = true
    }
  }, []) 

    // Scroll to the end of logs when they update
    useEffect(() => {
      logsEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [logs])
  
  
  
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
  console.log(ascii)

  const displayHelp = () => {
    setLogs(prev => [
      ...prev,
      "Available commands:",
      <>
        <span className="text-blue-500">register</span> <span>{"<username> <password> - Register a new user"}</span>
      </>,
      <>
        <span className="text-blue-500">login</span> <span>{"<username> <password> - Log in to an existing account"}</span>
      </>,
      <>
        <span className="text-blue-500">ls</span> <span>{"- List files in the current directory"}</span>
      </>,
      <>
        <span className="text-blue-500">cd</span> <span>{"<directory> - Change the current directory"}</span>
      </>,
      <>
        <span className="text-blue-500">run</span> <span>{"<game> - Launch a game"}</span>
      </>,
      <>
        <span className="text-blue-500">whoami</span> <span>{"- Display the current user"}</span>
      </>,
      <>
        <span className="text-blue-500">whoareyou</span> <span>{"- Learn more about me"}</span>
      </>,
      <>
        <span className="text-blue-500">clear</span> <span>{"- Clear the terminal logs"}</span>
      </>,
      <>
        <span className="text-blue-500">exit</span> <span>{"- Log out of the current account"}</span>
      </>,
      <>
        <span className="text-blue-500">helpmore</span> <span>{"- Show more commands"}</span>
      </>,
      <>
        <span className="text-blue-500">help</span> <span>{"- Show this helpful message"}</span>
      </>,
    ])
  }
  
  


  const displayHelpMore = () => {
    setLogs(prev => [
      ...prev,
      "More commands:",
      <>
        <span className="text-blue-500">hello</span> <span>{"- Greet me!"}</span>
      </>,
      <>
        <span className="text-blue-500">time</span> <span>{"- Display the current date/time"}</span>
      </>,
      <>
        <span className="text-blue-500">magic8ball</span> <span>{"- Ask the magic 8-ball a question"}</span>
      </>,
      <>
        <span className="text-blue-500">coinflip</span> <span>{"- Flip a coin"}</span>
      </>,
      <>
        <span className="text-blue-500">d20, d12, d10, d8, d6, d4</span> <span>{"- Roll a die"}</span>
      </>,
      <>
        <span className="text-blue-500">joke</span> <span>{"- Tell a joke"}</span>
      </>,
      <>
        <span className="text-blue-500">...</span> <span>{"and more to discover!"}</span>
      </>,
    ])
  }
  

  const handleCommand = (event) => {
    if (event.key === KEY_ENTER && input.trim()) {
      const command = input.trim().split(" ")[0]
      const args = input.trim().split(" ").slice(1)
  
      // Log the user input, display in green
      setLogs(prev => [
        ...prev,
        <div className="text-green-400 p-4">{`> ${input}`}</div> // Make input text green
      ])
  
      switch (command) {
        // User-related commands
        case "register":
          args.length < 2
            ? setLogs(prev => [...prev, "Usage: register <username> <password>"])
            : registerUser(args[0], args[1])
          break
        case "login":
          args.length < 2
            ? setLogs(prev => [...prev, "Usage: login <username> <password>"])
            : loginUser(args[0], args[1])
          break
        case "whoami":
          currentUser
            ? setLogs(prev => [...prev, `You are logged in as "${currentUser}".`])
            : setLogs(prev => [...prev, <span>You are not currently logged in. Maybe <b>you're</b> a grue...</span>])
          break
        case "whoareyou":
          setLogs(prev => [...prev, "The grue is a sinister, lurking presence in the dark places of the earth. Its favorite diet is adventurers, but its insatiable appetite is tempered by its fear of light."])
          break
  
        // System-related commands
        case "clear":
        case "c":
          clearLogs()
          break
        case "help":
          displayHelp()
          break
        case "helpmore":
          displayHelpMore()
          break
  
        // Directory and file-related commands
        case "ls":
          listDirectory()
          break
        case "cd":
          changeDirectory(args[0])
          break
  
        // Game-related commands
        case "run":
        case "open":
          if (currentDir === "/games") {
            // Show "Launching Game" and animate dots
            setLogs(prev => [...prev, "Launching Game"])
  
            let dotCount = 0
            const interval = setInterval(() => {
              dotCount += 1
              setLogs(prev => [
                ...prev.slice(0, prev.length - 1),
                `Launching Game${'.'.repeat(dotCount)}`
              ])
  
              if (dotCount === 3) {
                clearInterval(interval)
  
                const gameName = args[0].toLowerCase()
                switch (gameName) {
                  case "in between":
                  case "inbetween":
                  case "in-between":
                    window.open("https://homies-llc.github.io/In-Between/", "_blank")
                    break
                  case "sigil":
                  case "sigil the city of doors":
                  case "sigil-the-city-of-doors":
                    window.open("https://orkothemage.github.io/Sigil-The-City-of-Doors/sigil.html", "_blank")
                    break
                  default:
                    setLogs(prev => [...prev, `No game found with the name "${args[0]}"`])
                }
              }
            }, 1000)
          }
          break
  
        // Fun commands
        case "xyzzy":
          setLogs(prev => [...prev, "I see what you did there..."])
          break
        case "hello":
        case "hi":
        case "hey": 
          setLogs(prev => [...prev, "Hello!"])
          break
        case "time":
          setLogs(prev => [
            ...prev,
            new Date().toLocaleTimeString(),
            new Date().toLocaleDateString()
          ])
          break
          case "magic8ball":
          const responses = [
            "It is certain.",
            "It is decidedly so.",
            "Without a doubt.",
            "Yes – definitely.",
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
          const randomResponse = responses[Math.floor(Math.random() * responses.length)]
          setLogs(prev => [...prev, randomResponse])
          break
        case "coinflip":
          const coin = Math.random() < 0.5 ? "Heads" : "Tails"
          setLogs(prev => [...prev, coin])
          break
        case "d20":
          const roll = Math.floor(Math.random() * 20) + 1
          setLogs(prev => [...prev, `You rolled a ${roll}`])
          break
        case "d12":
          const rollD12 = Math.floor(Math.random() * 12) + 1
          setLogs(prev => [...prev, `You rolled a ${rollD12}`])
          break
        case "d10":
          const rollD10 = Math.floor(Math.random() * 10) + 1
          setLogs(prev => [...prev, `You rolled a ${rollD10}`])
          break
        case "d8":
          const rollD8 = Math.floor(Math.random() * 8) + 1
          setLogs(prev => [...prev, `You rolled a ${rollD8}`])
          break
        case "d6":
          const rollD6 = Math.floor(Math.random() * 6) + 1
          setLogs(prev => [...prev, `You rolled a ${rollD6}`])
          break
        case "d4":
          const rollD4 = Math.floor(Math.random() * 4) + 1
          setLogs(prev => [...prev, `You rolled a ${rollD4}`])
          break
        case "joke":
            fetch("https://official-joke-api.appspot.com/random_joke")
              .then(res => res.json())
              .then(data => setLogs(prev => [...prev, `${data.setup} - ${data.punchline}`]))
              .catch(() => setLogs(prev => [...prev, "Error fetching joke."]))
            break
          

      
        // Exit command
        case "exit":
          exitCli()
          break
  
        // Command not found
        default:
          setLogs(prev => [...prev, `Command '${command}' not found.`])
          break
      }
  
      // Store command in history
      setCommandHistory([...commandHistory, input.trim()])
      setHistoryIndex(commandHistory.length)
      setInput("")
    }
  }
  
  

  const registerUser = (username, password) => {
    const userExists = users.some(user => user.username === username)

    if (userExists) {
      addLog(`Username "${username}" is already taken.`)
      return
    }

    setUsers(prev => [...prev, { username, password }])
    addLog(`User "${username}" registered successfully.`)
  }

  const loginUser = (username, password) => {
    const user = users.find(user => user.username === username)

    if (!user) {
      addLog(`User "${username}" not found.`)
      return
    }

    if (user.password !== password) {
      addLog(`Incorrect password for "${username}".`)
      return
    }

    setCurrentUser(username)
    addLog(`Welcome back, "${username}"!`)
  }

  const clearLogs = () => {
    setLogs([])
    setInput("")
  }

  const addLog = (newLog) => {
    setTimeout(() => {
      setLogs(prevLogs => [...prevLogs, newLog])
    }, 1500)
  }

  const exitCli = () => {
    if (!currentUser) {
      setLogs(prev => [...prev, "You are not currently logged in."])
      return
    }
  
    setLogs(prev => [...prev, "Logging out"])
  
    let dotCount = 0
    const interval = setInterval(() => {
      dotCount += 1
      setLogs(prev => [
        ...prev.slice(0, prev.length - 1),
        `Logging out${'.'.repeat(dotCount)}`
      ])
  
      if (dotCount === 3) {
        clearInterval(interval)
        setCurrentUser(null)
        setInput("")
        setLogs(prev => [
          ...prev,
          "Logged out successfully.",
          "Restarting" // New message before restart
        ])
  
        // Set a timeout of 5 seconds to trigger the restart with dots
        let restartDotCount = 0
        const restartInterval = setInterval(() => {
          restartDotCount += 1
          setLogs(prev => [
            ...prev.slice(0, prev.length - 1),
            `Restarting${'.'.repeat(restartDotCount)}`
          ])
  
          if (restartDotCount === 5) {
            clearInterval(restartInterval)
            setTimeout(() => {
              window.location.reload() // Forces the page to reload after 5 seconds
            }, 1000) // Delay the reload by 1 second after the dots finish
          }
        }, 1000) // Interval to update the "Restarting..." dots every second
      }
    }, 1000) // Interval for "Logging out" dots every second
  }
  

  const generatePrompt = () => {
    return currentUser
      ? <span className="text-green-400">{`${currentUser}@system:`}</span>
      : <span className="text-green-400">system:</span>
  }

  const listDirectory = () => {
    if (currentDir === "/") {
      setLogs(prev => [
        ...prev,
        <div>
          <span className="text-blue-500 mr-4">games</span>
          <span className="text-blue-500 mr-4">projects</span>
          <span className="text-blue-500">con</span>
        </div>
      ])
    } else if (currentDir === "/games") {
      setLogs(prev => [
        ...prev,
        <div>
          <a
            href="https://homies-llc.github.io/In-Between/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500"
          >
            In Between
          </a>
        </div>,
        <div>
          <a
            href="https://orkothemage.github.io/Sigil-The-City-of-Doors/sigil.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500"
          >
            Sigil: The Doors
          </a>
        </div>
      ])
    } else {
      setLogs(prev => [...prev, "No files or directories found."])
    }
  }
  

  const changeDirectory = (dir) => {
    if (dir === "games" && currentDir === "/") {
      setCurrentDir("/games")
    } else if (dir === "resume" && currentDir === "/") {
  window.open("https://drive.google.com/file/d/1XuhPuQzuN8jNntMIOXAaqMQYS8f8B_tn/view?usp=sharing", "_blank")
    } else if (dir === "github" && currentDir === "/") {
      window.open("https://github.com/OrkoTheMage", "_blank")
  }
    else if (dir === ".." && currentDir === "/games") {
      setCurrentDir("/")
    } else {
      setLogs(prev => [...prev,`Directory '${dir}' not found.` ])
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen text-white font-mono">
      <div className="w-full max-w-3xl p-6">
        <div className="h-full w-full">
          {logs.map((log, index) => (
            <div key={index} className="text-2xl mb-2 h-full whitespace-pre">{log}</div>
          ))}
          {/* This div will always scroll into view */}
          <div ref={logsEndRef} />
          <div className="flex items-center text-2xl pt-12">
            <span className="pr-2 text-2xl">{generatePrompt()}</span>
            <span className="text-blue-500 mr-2">~{currentDir}</span>
            <span className="text-white"> </span>
            <span className="text-white mr-2">$</span>
            <input
              type="text"
              className="bg-transparent border-none outline-none text-white w-full text-2xl caret-white"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleCommand}
              autoFocus
            />
          </div>
        </div>
      </div>
    </div>
  )
}
