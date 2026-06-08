"use client"
import React, { useEffect, useRef, useState } from "react"
import { 
  clearLogs,
  generatePrompt, 
  loadUserSecrets, 
  secretDiscovered, 
  getGreetings, 
  getMagic8BallResponses, 
  stats, 
  ps, 
  kill,
  animateDotsWithMessage
} from "../../utils/CLIUtils"
import { changeDirectory, listDirectory, catFile } from "../../utils/directoryUtils"
import { registerUser, loginUser, updateUserStat, } from "../../utils/auth"
import { displayHelp, displayHelpMore } from "../../utils/displayHelp"
import { startupMsg } from "../../utils/startupMsg"

export default function CLI() {
  const [startupComplete, setStartupComplete] = useState(false)
  const [input, setInput] = useState("")
  const [logs, setLogs] = useState([])
  const [commandHistory, setCommandHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [currentUser, setCurrentUser] = useState(null)
  const [currentDir, setCurrentDir] = useState("/")
  const [startTime, setStartTime] = useState(null)
  
  // pendingAuth: null | { type: 'login'|'register', stage: 'username'|'password'|'confirm', username?: string, password?: string }
  // Multi-stage auth flow — mirrors Linux/macOS terminal login behaviour
  const [pendingAuth, setPendingAuth] = useState(null)

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
  const inputRef = useRef(null)

  const startupRan = useRef(false)

  // Display startup message
  useEffect(() => {
    // Guard against React 18 Strict Mode double-invocation and any accidental
    // remounts. useRef persists across the fake unmount/remount cycle so the
    // second pass sees startupRan.current === true and bails out immediately.
    if (startupRan.current) return
    startupRan.current = true

    const { start, cleanup } = startupMsg(setLogs, () => {
      setStartupComplete(true)
    })
    start()
    setStartTime(new Date())

    // Cancel any in-flight timers if the component genuinely unmounts
    return cleanup
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
    if (event.key === "Enter") {
      // Empty Enter during an auth prompt cancels the flow
      if (pendingAuth && !input.trim()) {
        displayMsg("Cancelled.")
        setPendingAuth(null)
        setInput("")
        return
      }

      if (!input.trim()) return

      // ===== PENDING AUTH (multi-stage) =====
      if (pendingAuth) {
        const value = input.trim()

        if (pendingAuth.stage === 'username') {
          setLogs(prev => [
            ...prev,
            <div className="text-green-400 p-4">
              {pendingAuth.type === 'login' ? 'login:' : 'Username:'} {value}
            </div>
          ])
          setPendingAuth({ ...pendingAuth, stage: 'password', username: value })
          setHistoryIndex(commandHistory.length)
          setInput("")
          return
        }

        if (pendingAuth.stage === 'password') {
          setLogs(prev => [
            ...prev,
            <div className="text-green-400 p-4">Password: ••••••••</div>
          ])
          if (pendingAuth.type === 'login') {
            loginUser(pendingAuth.username, value, displayMsg, setCurrentUser)
            setPendingAuth(null)
          } else {
            setPendingAuth({ ...pendingAuth, stage: 'confirm', password: value })
          }
          setHistoryIndex(commandHistory.length)
          setInput("")
          return
        }

        if (pendingAuth.stage === 'confirm') {
          setLogs(prev => [
            ...prev,
            <div className="text-green-400 p-4">Confirm password: ••••••••</div>
          ])
          if (value !== pendingAuth.password) {
            displayMsg("Passwords do not match. Please try again.")
            setPendingAuth({ type: 'register', stage: 'password', username: pendingAuth.username })
          } else {
            registerUser(pendingAuth.username, value, displayMsg)
            setPendingAuth(null)
          }
          setHistoryIndex(commandHistory.length)
          setInput("")
          return
        }
      }

      // ===== NORMAL COMMAND HANDLING =====
      const command = input.trim().split(" ")[0]
      const args = input.trim().split(" ").slice(1)
  
      setLogs(prev => [
        ...prev,
        <div className="text-green-400 p-4">{`> ${input}`}</div>
      ])
  
      switch (command) {
        // ===== USER ACCOUNT COMMANDS =====
        case "login":
          if (currentUser) {
            displayMsg(`Already logged in as "${currentUser}". Use 'logout' first.`)
          } else if (args.length === 0) {
            setPendingAuth({ type: 'login', stage: 'username' })
          } else {
            setPendingAuth({ type: 'login', stage: 'password', username: args[0] })
          }
          break

        case "logout":
          currentUser
            ? (setCurrentUser(null), displayMsg("You have been logged out."))
            : displayMsg("You are not currently logged in.")
          break

        case "register":
          if (currentUser) {
            displayMsg(`Already logged in as "${currentUser}". Please logout first.`)
          } else if (args.length === 0) {
            setPendingAuth({ type: 'register', stage: 'username' })
          } else {
            setPendingAuth({ type: 'register', stage: 'password', username: args[0] })
          }
          break

        case "stats":
          stats(currentUser, displayMsg, setLogs)
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
          displayMsg("Grue.sh v1.1.0")
          break

        case "ps":
          ps(startTime, displayMsg)
          break

        case "kill":
          kill(args, displayMsg, setLogs)
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
                displayMsg("-------------------------------------------------"),
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

        // ===== OPEN COMMAND (projects, games & contact) =====
        case "open":
          if (!args[0]) {
            displayMsg("Usage: open <name>")
            break
          }
          {
            const target = args[0].toLowerCase()
            const base = process.env.NEXT_PUBLIC_API_URL

            if (currentDir === "/projects") {
              const projectUrls = {
                "js-presenter":    `${base}/js-presenter`,
                "cli-presenter":   `${base}/cli-presenter`,
                "orkos-todo-tool": `${base}/orkos-todo-tool`,
              }
              const normalizedTarget = target.replace(/-/g, "")
              const matchedKey = Object.keys(projectUrls).find(
                k => k.replace(/-/g, "") === normalizedTarget
              )
              if (matchedKey) {
                animateDotsWithMessage(`Opening ${matchedKey}`, 3, setLogs, () => {
                  window.open(projectUrls[matchedKey], "_blank")
                })
              } else {
                displayMsg(`No project found with the name "${args[0]}".`)
                displayMsg("Available projects: js-presenter, cli-presenter, orkos-todo-tool")
              }

            } else if (currentDir === "/contact") {
              if (target === "github") {
                animateDotsWithMessage("Opening GitHub", 3, setLogs, () => {
                  window.open("https://github.com/OrkoTheMage", "_blank")
                })
              } else if (target === "resume") {
                animateDotsWithMessage("Opening resume", 3, setLogs, () => {
                  window.open(`${base}/resume`, "_blank")
                })
              } else if (target === "contactinfo.md") {
                displayMsg("Use 'cat contactinfo.md' to read contact info directly in the terminal.")
              } else {
                displayMsg(`No file found with the name "${args[0]}".`)
                displayMsg("Available files: resume, github, contactinfo.md")
              }

            } else if (currentDir === "/games") {
              const gameUrls = {
                "in-between":   `${base}/in-between`,
                "sigil":         `${base}/sigil`,
                "venture":       `${base}/venture`,
              }
              const normalizedTarget = target.replace(/-/g, "")
              const matchedKey = Object.keys(gameUrls).find(
                k => k.replace(/-/g, "") === normalizedTarget
              )
              if (matchedKey) {
                animateDotsWithMessage(`Opening ${matchedKey}`, 3, setLogs, () => {
                  window.open(gameUrls[matchedKey], "_blank")
                })
              } else {
                displayMsg(`No game found with the name "${args[0]}".`)
                displayMsg("Available games: in-between, sigil, venture")
              }

            } else {
              displayMsg("Navigate to /projects, /games, or /contact to use 'open'.")
              displayMsg("Usage: cd projects  |  cd games  |  cd contact")
            }
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
          const greetings = getGreetings()
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
          const responses = getMagic8BallResponses()
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
          displayMsg("You cannot go anywhere.")
          displayMsg("..You are stuck in the darkness.")
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
          displayMsg("-------------------------------------------------")
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
  
      const newHistory = [...commandHistory, input.trim()]
      setCommandHistory(newHistory)
      setHistoryIndex(newHistory.length)
      setInput("")
    }
    
    if (event.key === "ArrowUp") {
      if (historyIndex > 0) {
        const prev = historyIndex - 1
        setHistoryIndex(prev)
        setInput(commandHistory[prev])
        requestAnimationFrame(() => {
          if (inputRef.current) {
            const len = commandHistory[prev].length
            inputRef.current.setSelectionRange(len, len)
          }
        })
      }
    } else if (event.key === "ArrowDown") {
      if (historyIndex < commandHistory.length) {
        const next = historyIndex + 1
        const val = next >= commandHistory.length ? "" : commandHistory[next]
        setHistoryIndex(next)
        setInput(val)
        requestAnimationFrame(() => {
          if (inputRef.current) {
            const len = val.length
            inputRef.current.setSelectionRange(len, len)
          }
        })
      }
    }
  }

  return (
    <div
      className="flex items-center justify-center min-h-screen text-white font-mono"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="w-full max-w-3xl p-6">
        <div className="h-full w-full">
          {logs.map((log, index) => (
            <div key={index} className="text-2xl mb-2 h-full whitespace-pre">{log}</div>
          ))}
          <div ref={logsEndRef} />
          <div className="flex items-center text-2xl pt-12">
            {startupComplete && (
              <>
                {pendingAuth ? (
                  // Multi-stage auth prompt
                  pendingAuth.stage === 'username' ? (
                    <>
                      <span className="pr-2 text-2xl text-green-400">
                        {pendingAuth.type === 'login' ? 'login:' : 'Username:'}
                      </span>
                      <input
                        type="text"
                        ref={inputRef}
                        className="bg-transparent border-none outline-none text-white w-full text-2xl font-mono cli-input"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleCommand}
                        autoFocus
                      />
                    </>
                  ) : (
                    <>
                      <span className="pr-2 text-2xl text-green-400">
                        {pendingAuth.stage === 'confirm' ? 'Confirm password:' : 'Password:'}
                      </span>
                      <input
                        type="password"
                        ref={inputRef}
                        className="bg-transparent border-none outline-none text-white w-full text-2xl font-mono cli-input"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleCommand}
                        autoFocus
                      />
                    </>
                  )
                ) : (
                  // Normal command mode
                  <>
                    <span className="pr-2 text-2xl">{generatePrompt(currentUser)}</span>
                    <span className="text-blue-500 mr-2">~{currentDir}</span>
                    <span className="text-white mr-2">$</span>
                    <input
                      type="text"
                      ref={inputRef}
                      className="bg-transparent border-none outline-none text-white w-full text-2xl font-mono cli-input"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleCommand}
                      autoFocus
                    />
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
  
}
