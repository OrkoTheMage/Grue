"use client"
import { useEffect, useRef, useState } from "react"
import { startupMsg } from "./startupMsg"
import { displayHelp, displayHelpMore } from "./displayHelp"
import { registerUser, loginUser } from "./auth"
import { clearLogs, exitCli, generatePrompt } from "./CLIUtils"
import { changeDirectory, listDirectory } from "./directoryUtils"

export default function CLI() {
  const [input, setInput] = useState("")
  const [logs, setLogs] = useState([])
  const [commandHistory, setCommandHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [currentUser, setCurrentUser] = useState(null)
  const [currentDir, setCurrentDir] = useState("/")

  const logsEndRef = useRef(null)
  useEffect(() => {
    const typeNextMessage = startupMsg(setLogs)
    typeNextMessage(() => {})  // Start the typing animation
  }, [])

    useEffect(() => {
      logsEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [logs])

    const displayMsg = (msg) => {
      setLogs(prev => [...prev, msg])
    }
  
  
  const handleCommand = (event) => {
    if (event.key === "Enter" && input.trim()) {
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
            ? displayMsg("Usage: register <username> <password>")
            : registerUser(args, displayMsg)
          break
        case "login":
          args.length < 2
            ? displayMsg("Usage: login <username> <password>")
            : loginUser(args, displayMsg, setCurrentUser)
          break
        case "whoami":
          currentUser
            ? displayMsg(`You are logged in as "${currentUser}".`)
            : displayMsg("You are not currently logged in. Maybe you're a grue...")
          break
        case "whoareyou":
          displayMsg("The grue is a sinister, lurking presence in the dark places of the earth.\nIts favorite diet is adventurers,\nbut its insatiable appetite is tempered by its fear of light.")
          break
  
        // System-related commands
        case "clear":
        case "c":
          clearLogs(setLogs, setInput)
          break
        case "help":
          displayHelp(setLogs)
          break
        case "helpmore":
          displayHelpMore(setLogs)
          break
  
        // Directory and file-related commands
        case "ls":
          listDirectory(currentDir, setLogs)
          break
        case "cd":
          changeDirectory(args[0], currentDir, setCurrentDir, setLogs)
          break
  
        // Game-related commands
        case "run":
        case "open":
          if (currentDir === "/games") {
            // Show "Launching Game" and animate dots
            displayMsg("Launching Game")
  
            let dotCount = 0
            const interval = setInterval(() => {
              dotCount += 1
              displayMsg(`Launching Game${'.'.repeat(dotCount)}`)
  
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
                    displayMsg(`No game found with the name "${args[0]}"`)
                }
              }
            }, 1000)
          }
          break
  
        // Fun commands
        case "xyzzy":
          displayMsg("I see what you did there...")
          break

        case "hello":
        case "hi":
        case "hey": 
          const randomeGreetings = ["Hello! How can I help you today?", "Hi! What can I do for you?", "Hey! What's up?"]
          displayMsg(randomeGreetings[Math.floor(Math.random() * randomeGreetings.length)])
          break

          case "time":
          displayMsg(`${new Date().toLocaleTimeString()} - ${new Date().toLocaleDateString()}`)
          break

          case "magic8ball":
          const responses = [
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
          const randomResponse = responses[Math.floor(Math.random() * responses.length)]
          displayMsg(randomResponse)
          break
 
          case "coinflip":
          const coin = Math.random() < 0.5 ? "Heads" : "Tails"
          displayMsg(coin)
          break

          case "d20":
          const roll = Math.floor(Math.random() * 20) + 1
          displayMsg(`You rolled a ${roll}`)
          break

          case "d12":
          const rollD12 = Math.floor(Math.random() * 12) + 1
          displayMsg(`You rolled a ${rollD12}`)
          break

          case "d10":
          const rollD10 = Math.floor(Math.random() * 10) + 1
          displayMsg(`You rolled a ${rollD10}`)
          break

          case "d8":
          const rollD8 = Math.floor(Math.random() * 8) + 1
          displayMsg(`You rolled a ${rollD8}`)
          break

          case "d6":
          const rollD6 = Math.floor(Math.random() * 6) + 1
          displayMsg(`You rolled a ${rollD6}`)
          break

          case "d4":
          const rollD4 = Math.floor(Math.random() * 4) + 1
          displayMsg(`You rolled a ${rollD4}`)
          break

          case "joke":
          fetch("https://official-joke-api.appspot.com/random_joke")
            .then(res => res.json())
            .then(data => displayMsg(`${data.setup} - ${data.punchline}`))
            .catch(() => displayMsg("Error fetching joke."))
          break
  
        // Exit command
        case "exit":
        case "quit":
        case "logout":
          exitCli(setLogs, setInput, setCurrentUser, currentUser)
          break

        case "restart":
        case "reload":
        case "refresh":
        case "reboot":
          window.location.reload()
          break
  
        // Command not found
        default:
          displayMsg(`Command '${command}' not found.`)
          break
      }
  
      // Store command in history
      setCommandHistory([...commandHistory, input.trim()])
      setHistoryIndex(commandHistory.length)
      setInput("")
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
            <span className="pr-2 text-2xl">{generatePrompt(currentUser)}</span>
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
