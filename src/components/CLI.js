"use client"
import React, { useEffect, useRef, useState } from "react"
import { startupMsg } from "./startupMsg"
import { displayHelp, displayHelpMore } from "./displayHelp"
import { registerUser, loginUser, updateUserStat, getUserStatistics } from "./auth"
import { animateDotsWithMessage, clearLogs, createIframe, exitCli, generatePrompt, loadUserSecrets, secretDiscovered } from "./CLIUtils"
import { changeDirectory, listDirectory, catFile } from "./directoryUtils"

export default function CLI() {
  const [startupComplete, setStartupComplete] = useState(false)
  const [input, setInput] = useState("")
  const [logs, setLogs] = useState([])
  const [commandHistory, setCommandHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [currentUser, setCurrentUser] = useState(null)
  const [currentDir, setCurrentDir] = useState("/")
  const [startTime, setStartTime] = useState(null)
  const [foundSecrets, setFoundSecrets] = useState({
    xyzzy: false,
    inventory: false,
    wait: false,
    examine: false,
    direction: false, 
    light: false,
    sudo: false,
    help: false,
    touch: false,
    rm: false,
    man: false,
    mkdir: false,
    cp: false,
    df: false
  })
  const logsEndRef = useRef(null)

  // Display startup message
  useEffect(() => {
    const typeNextMessage = startupMsg(setLogs, () => {
      setStartupComplete(true)    })
    typeNextMessage()
    setStartTime(new Date())
  }, [])

  // Fetch discovered secrets when user logs in
  useEffect(() => {
    if (currentUser) {
      loadUserSecrets(currentUser, setFoundSecrets)
    }
  }, [currentUser])

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
  
      setLogs(prev => [
        ...prev,
        <div className="text-green-400 p-4">{`> ${input}`}</div>
      ])
  
      switch (command) {
        // ===== USER ACCOUNT COMMANDS =====
        case "login":
          args.length < 2
            ? displayMsg("Usage: login <username> <password>")
            : loginUser(args, displayMsg, setCurrentUser)
          break

        case "logout":
          currentUser
            ? (setCurrentUser(null), displayMsg("You have been logged out."))
            : displayMsg("You are not currently logged in.")
          break

        case "register":
          args.length < 2
            ? displayMsg("Usage: register <username> <password>")
            : registerUser(args, displayMsg)
          break

        case "stats":
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
          break

        case "whoami":
        case "who":
          currentUser
            ? displayMsg(`You are logged in as "${currentUser}".`)
            : displayMsg("You are not currently logged in. Maybe you're a grue too...")
          break

        case "whoareyou":
        case "whoru":
          displayMsg("A grue. A sinister, lurking presence in the dark places of the earth.\nMy favorite diet is adventurers,\nMy insatiable appetite is tempered by my fear of light.")
          break
          
        // ===== SYSTEM COMMANDS =====
        case "c":
        case "clear":
          clearLogs(setLogs, setInput)
          break

        case "echo":
          args.length === 0
            ? displayMsg("")
            : displayMsg(args.join(" "))
          break

        case "help":
          displayHelp(setLogs)
          break

        case "helpmore":
          displayHelpMore(setLogs)
          currentUser && secretDiscovered(currentUser, 'help', foundSecrets, setFoundSecrets, displayMsg)
          break

        case "reboot":
        case "refresh":
        case "reload":
        case "reset":
        case "restart":
          window.location.reload()
          break

        case "time":
          displayMsg(`${new Date().toLocaleTimeString()} - ${new Date().toLocaleDateString()}`)
          break
                
        case "version":
        case "ver":
        case "v":
        case "--v":
        case "--version":
          displayMsg("Grue.sh v1.0.0")
          break

        case "ps":
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
          break

          case "kill":
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
            break        

        case "df":
        case "du":
        case "top":
          displayMsg("Accessing system data...")

          displayMsg(<span className="text-red-500">Access denied: the grue does not have access to your system data.</span>)
          displayMsg("...for now.")
          currentUser && secretDiscovered(currentUser, 'df', foundSecrets, setFoundSecrets, displayMsg)
          break
        
        

        // ===== DIRECTORY/FILE COMMANDS =====
        case "cat":
          args.length === 0
            ? displayMsg("Usage: cat <filename>")
            : catFile(args[0], currentDir, setLogs)
          break

        case "cd":
          changeDirectory(args, currentDir, setCurrentDir, setLogs)
          break

        case "ls":
          listDirectory(currentDir, setLogs)
          break

        case "pwd":
          displayMsg(
            currentDir === "/"
              ? (
                currentUser
                  ? `/home/${currentUser}`
                  : "/home/guest"
              )
              : `/home/${currentUser || "guest"}${currentDir}`
          )
          break
          
        case "mkdir":
          args.length === 0
            ? displayMsg("Usage: mkdir <dirname>")
            : (
                displayMsg(`Attempting to create ${args[0]}...`),
                displayMsg(<span className="text-red-500">Permission denied: the grue have disabled directory creation.</span>),
                currentUser && secretDiscovered(currentUser, 'mkdir', foundSecrets, setFoundSecrets, displayMsg)
              )
          break

        case "man":
          args.length === 0
            ? displayMsg("What manual page do you want?")
            : (
                displayMsg(<span className="text-blue-500">GRUE MANUAL SYSTEM</span>),
                displayMsg("---------------------------------"),
                displayMsg(`No manual entry for ${args[0]}`),
                displayMsg("(The grue has eaten all the documentation)"),
                currentUser && secretDiscovered(currentUser, 'man', foundSecrets, setFoundSecrets, displayMsg)
              )
          break

        case "rm":
          args.length === 0
            ? displayMsg("Usage: rm <filename>")
            : (
                displayMsg(`Attempting to delete ${args[0]}...`),
                displayMsg(<span className="text-red-500">Permission denied: the grue have disabled file deletion.</span>),
                currentUser && secretDiscovered(currentUser, 'rm', foundSecrets, setFoundSecrets, displayMsg)
            )
          break

        case "touch":
          args.length === 0
            ? displayMsg("Usage: touch <filename>")
            : (
                displayMsg(`Attempting to create ${args[0]}...`),
                displayMsg(<span className="text-red-500">Permission denied: the grue have disabled file creation.</span>),
                currentUser && secretDiscovered(currentUser, 'touch', foundSecrets, setFoundSecrets, displayMsg)
              )
          break

        case "cp":
        case "mv":
          args.length === 0
            ? displayMsg("Usage: cp/mv <source> <destination>")
            : ( 
              displayMsg("Attempting to copy/move files..."),
              displayMsg(<span className="text-red-500">Permission denied: the grue have disabled file copying/moving.</span>),
              currentUser && secretDiscovered(currentUser, 'cp', foundSecrets, setFoundSecrets, displayMsg)
            )
          break

        // ===== GAME COMMANDS =====  
        case "open":
        case "run":
        case "play":
        case "start":
        case "launch":
          if (currentDir === "/games") {
            const gameName = args[0]?.toLowerCase()
            if (!gameName) {
              displayMsg("Usage: run <game-name>")
              break
            }
        
            switch (gameName) {
              case "in-between":
              case "inbetween":
                animateDotsWithMessage("Launching Game", 4, setLogs, () => {
                  setLogs(prev => [
                    ...prev,
                    createIframe("inbetween", "https://homies-llc.github.io/In-Between/", "In Between")
                  ])
                  currentUser && updateUserStat(currentUser, "gamesPlayed")
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
                  currentUser && updateUserStat(currentUser, "gamesPlayed")
                })
                break

              default:
                displayMsg(`No game found with the name "${args[0]}"`)
            }
          } else {
            displayMsg("Games can only be run from the /games directory")
          }
          break

        // ===== FUN/UTILITY COMMANDS =====
        case "coinflip":
          const coin = Math.random() < 0.5 ? "Heads" : "Tails"
          displayMsg(`Flipping coin... It's ${coin}!`)
          currentUser && updateUserStat(currentUser, "coinsFlipped")
          break

        case "d4":
        case "d6":
        case "d8":
        case "d10":
        case "d12":
        case "d20":
          const diceSize = parseInt(command.substring(1))
          const roll = Math.floor(Math.random() * diceSize) + 1
          displayMsg(`Rolling a ${command}... You got a ${roll}!`)
          currentUser && updateUserStat(currentUser, "diceRolled")
          break

        case "hey": 
        case "hello":
        case "hi":
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

        case "joke":
          fetch("https://official-joke-api.appspot.com/random_joke")
            .then(res => res.json())
            .then(data => displayMsg(`${data.setup} - ${data.punchline}`))
            .catch(() => displayMsg("Error fetching joke."))
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
          currentUser && updateUserStat(currentUser, "magic8ballUsed")
          break

        case "passwordgen":
          const length = args[0] ? parseInt(args[0]) : 12
          const password = Array.from({ length }, () => String.fromCharCode(Math.floor(Math.random() * 93) + 33)).join("")
          displayMsg(`Generated password: ${password}`)
          displayMsg("Use it wisely!")
          break
          
        // ===== SECRET COMMANDS =====
        case "e":
        case "east":
        case "n":
        case "north":
        case "s":
        case "south":
        case "w":
        case "west":
          displayMsg("You cannot go that anywhere.")
          displayMsg("..You are stuck in the darkness")
          currentUser && secretDiscovered(currentUser, 'direction', foundSecrets, setFoundSecrets, displayMsg)
          break

        case "examine":
        case "look":
        case "x":
          displayMsg("You examine your surroundings carefully...")
          displayMsg("You see a faint cursor blinking in the darkness.")
          displayMsg("There might be a grue nearby.")
          currentUser && secretDiscovered(currentUser, 'examine', foundSecrets, setFoundSecrets, displayMsg)
          break

        case "i":
        case "inventory":
          displayMsg(<span className="text-blue-500">Inventory:</span>)
          displayMsg("- A terminal window")
          displayMsg("- Some unfinished code")
          displayMsg("- A vague sense of purpose")
          currentUser && secretDiscovered(currentUser, 'inventory', foundSecrets, setFoundSecrets, displayMsg)
          break

        case "sudo":
        case "chmod":
          displayMsg("Nice try, but you're not the superuser here!")
          currentUser && secretDiscovered(currentUser, 'sudo', foundSecrets, setFoundSecrets, displayMsg)
          break

        case "wait":
        case "z":
          displayMsg("Time passes... The cursor continues to blink.")
          currentUser && secretDiscovered(currentUser, 'wait', foundSecrets, setFoundSecrets, displayMsg)
          break

        case "xyzzy":
          displayMsg("You speak the magic words, but nothing happens…")
          currentUser && secretDiscovered(currentUser, 'xyzzy', foundSecrets, setFoundSecrets, displayMsg)
          break
        
        case "light":
        case "torch":
        case "match":
        case "lantern":
          displayMsg("You strike a match, and for a brief moment, the darkness recedes.")
          displayMsg("A pair of glowing eyes stare at you from the abyss... and then vanish.")
          currentUser && secretDiscovered(currentUser, 'light', foundSecrets, setFoundSecrets, displayMsg)
          break

        // Default case
        default:
          displayMsg(`Command '${command}' not found.`)
          break
      }
  
      setCommandHistory([...commandHistory, input.trim()])
      setHistoryIndex(commandHistory.length)
      setInput("")
    }
    
    event.key === "ArrowUp"
      ? historyIndex > 0 && (
          setHistoryIndex(historyIndex - 1),
          setInput(commandHistory[historyIndex - 1])
        )
      : event.key === "ArrowDown" && (
          historyIndex < commandHistory.length - 1
            ? (setHistoryIndex(historyIndex + 1), setInput(commandHistory[historyIndex]))
            : (setHistoryIndex(commandHistory.length), setInput(""))
        )
  }

  return (
    <div className="flex items-center justify-center min-h-screen text-white font-mono">
      <div className="w-full max-w-3xl p-6">
        <div className="h-full w-full">
          {logs.map((log, index) => (
            <div key={index} className="text-2xl mb-2 h-full whitespace-pre">{log}</div>
          ))}
          <div ref={logsEndRef} />
          <div className="flex items-center text-2xl pt-12">
            {startupComplete && (
              <>
                <span className="pr-2 text-2xl">{generatePrompt(currentUser)}</span>
                <span className="text-blue-500 mr-2">~{currentDir}</span>
                <span className="text-white mr-2">$</span>
            <input
              type="text"
              className="bg-transparent border-none outline-none text-white w-full text-2xl caret-white"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleCommand}
              autoFocus
            />
            </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
  
}