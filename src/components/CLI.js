"use client"
import React, { useEffect, useRef, useState } from "react"
import { startupMsg } from "./startupMsg"
import { displayHelp, displayHelpMore } from "./displayHelp"
import { registerUser, loginUser, updateUserStat, getUserStatistics } from "./auth"
import { animateDotsWithMessage, clearLogs, createIframe, exitCli, generatePrompt } from "./CLIUtils"
import { changeDirectory, listDirectory } from "./directoryUtils"

export default function CLI() {
  const [input, setInput] = useState("")
  const [logs, setLogs] = useState([])
  const [commandHistory, setCommandHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [currentUser, setCurrentUser] = useState(null)
  const [currentDir, setCurrentDir] = useState("/")
  const [foundSecrets, setFoundSecrets] = useState({
    xyzzy: false,
    sudo: false,
    inventory: false,
    wait: false,
    examine: false,
    direction: false
  })
  const logsEndRef = useRef(null)

  // Display startup message
  useEffect(() => {
    const typeNextMessage = startupMsg(setLogs)
    typeNextMessage(() => {}) 
  }, [])

  // Scroll to the bottom of the logs
    useEffect(() => {
      logsEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [logs])
    
    const displayMsg = (msg) => {
      if (React.isValidElement(msg)) {
        setLogs(prev => [...prev, msg])
      } else {
        setLogs(prev => [...prev, String(msg)])
      }
    }
  
  const handleCommand = (event) => {
    if (event.key === "Enter" && input.trim()) {
      const command = input.trim().split(" ")[0]
      const args = input.trim().split(" ").slice(1)
  
      // Log the user input, display in green
      setLogs(prev => [
        ...prev,
        <div className="text-green-400 p-4">{`> ${input}`}</div>
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

          case "stats":
            if (!currentUser) {
              displayMsg("You must be logged in to view your stats.")
            } else {
              animateDotsWithMessage("Retrieving your stats", 4, setLogs, () => {
                getUserStatistics(currentUser, displayMsg).then(stats => {
                  if (stats) {
                    displayMsg(<span className="text-blue-500">Your Statistics:</span>)
                    displayMsg(`-------------------------------------------------`)
                    displayMsg(`Dice Rolled: ${stats.diceRolled || 0}`)
                    displayMsg(`Magic 8-Ball Used: ${stats.magic8ballUsed || 0}`)
                    displayMsg(`Coins Flipped: ${stats.coinsFlipped || 0}`)
                    displayMsg(`Games Played: ${stats.gamesPlayed || 0}`)
                    displayMsg(`Secrets Found: ${stats.secretsFound || 0}`)
                  }
                })
              })
            }
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
          changeDirectory(args, currentDir, setCurrentDir, setLogs)
          break
  

        // Game-related commands
          case "run":
          case "open":
              if (currentDir === "/games") {
                const gameName = args[0]?.toLowerCase()
                if (!gameName) {
                  displayMsg("Usage: run <game-name>")
                  break
                }
            
                switch (gameName) {
                  case "inbetween":
                  case "in-between":
                    animateDotsWithMessage("Launching Game", 4, setLogs, () => {
                      setLogs(prev => [
                        ...prev,
                        createIframe("inbetween", "https://homies-llc.github.io/In-Between/", "In Between")
                      ])
                      if (currentUser) {
                        updateUserStat(currentUser, "gamesPlayed")
                      }
                    })
                    break
                  case "sigil":
                  case "sigil-the-city-of-doors":
                  case "sigilthecityofdoors":
                    animateDotsWithMessage("Launching Game", 4, setLogs, () => {
                      setLogs(prev => [
                        ...prev,
                        createIframe("sigil", "https://orkothemage.github.io/Sigil-The-City-of-Doors/sigil.html", "Sigil")
                      ])
                      if (currentUser) {
                        updateUserStat(currentUser, "gamesPlayed")
                      }
                    })
                    break
                  default:
                    displayMsg(`No game found with the name "${args[0]}"`)
                }
              } else {
                displayMsg("Games can only be run from the /games directory")
              }
              break
  

        // Fun commands
        case "xyzzy":
          displayMsg("I see what you did there...")
          if (currentUser && !foundSecrets.xyzzy) {
            updateUserStat(currentUser, "secretsFound")
            setFoundSecrets(prev => ({...prev, xyzzy: true}))
            displayMsg(<span className="text-yellow-400">You found a secret!</span>)
          }
          break

        case "sudo":
          displayMsg("Nice try, but you're not the superuser here!")
          if (currentUser && !foundSecrets.sudo) {
            updateUserStat(currentUser, "secretsFound")
            setFoundSecrets(prev => ({...prev, sudo: true}))
            displayMsg(<span className="text-yellow-400">You found a secret!</span>)
          }
          break

          case "inventory":
          case "i":
            displayMsg("You are carrying:")
            displayMsg("- A terminal window")
            displayMsg("- Some unfinished code")
            displayMsg("- A vague sense of purpose")
            if (currentUser && !foundSecrets.inventory) {
              updateUserStat(currentUser, "secretsFound")
              setFoundSecrets(prev => ({...prev, inventory: true}))
              displayMsg(<span className="text-yellow-400">You found a secret!</span>)
            }
            break

            case "examine":
            case "x":
                  displayMsg("You examine your surroundings carefully...")
                  displayMsg("You see a faint cursor blinking in the darkness.")
                  displayMsg("There might be a grue nearby.")
                  if (currentUser && !foundSecrets.examine) {
                      updateUserStat(currentUser, "secretsFound")
                      setFoundSecrets(prev => ({...prev, examine: true}))
                      displayMsg(<span className="text-yellow-400">You found a secret!</span>)
                  }
                  break

            case "wait":
            case "z":
                  displayMsg("Time passes... The cursor continues to blink.")
                  if (currentUser && !foundSecrets.wait) {
                      updateUserStat(currentUser, "secretsFound")
                      setFoundSecrets(prev => ({...prev, wait: true}))
                      displayMsg(<span className="text-yellow-400">You found a secret!</span>)
                  }
                  break
                  
          case "north":
          case "south":
          case "east":
          case "west":
          case "n":
          case "s":
          case "e":
          case "w":    
                displayMsg("You cannot go that anywhere.")
                displayMsg("..You are stuck in the darkness")
                if (currentUser && !foundSecrets.direction) {
                    updateUserStat(currentUser, "secretsFound")
                    setFoundSecrets(prev => ({...prev, direction: true}))
                    displayMsg(<span className="text-yellow-400">You found a secret!</span>)
                }
                break

        

        case "hello":
        case "hi":
        case "hey": 
        const greetings = [
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
        const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)]
        displayMsg(randomGreeting)
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
          if (currentUser) {
            updateUserStat(currentUser, "magic8ballUsed")
          }
          break
 
          case "coinflip":
          const coin = Math.random() < 0.5 ? "Heads" : "Tails"
          displayMsg(`Flipping coin... It's ${coin}!`)
          if (currentUser) {
            updateUserStat(currentUser, "coinsFlipped")
          }
          break

          case "d20":
          case "d12":
          case "d10":
          case "d8":
          case "d6":
          case "d4":
            const diceSize = parseInt(command.substring(1))
            const roll = Math.floor(Math.random() * diceSize) + 1
            displayMsg(`Rolling a ${command}... You got a ${roll}!`)
            // Update stats if user is logged in
            if (currentUser) {
              updateUserStat(currentUser, "diceRolled")
            }
            break

          case "joke":
          fetch("https://official-joke-api.appspot.com/random_joke")
            .then(res => res.json())
            .then(data => displayMsg(`${data.setup} - ${data.punchline}`))
            .catch(() => displayMsg("Error fetching joke."))
          break

          case "passwordgen":
            const length = args[0] ? parseInt(args[0]) : 12
            const password = Array.from({ length }, () => String.fromCharCode(Math.floor(Math.random() * 93) + 33)).join("")
            displayMsg(`Generated password: ${password}`)
            displayMsg("Use it wisely!")
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
        case "reset":
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
    
    // Handle ArrowUp and ArrowDown key navigation through command history
    if (event.key === "ArrowUp") {
      if (historyIndex > 0) {
        setHistoryIndex(historyIndex - 1)
        setInput(commandHistory[historyIndex - 1])
      }
    } else if (event.key === "ArrowDown") {
      if (historyIndex < commandHistory.length - 1) {
        setHistoryIndex(historyIndex + 1)
        setInput(commandHistory[historyIndex])
      } else {
        setHistoryIndex(commandHistory.length)
        setInput("")
      }
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