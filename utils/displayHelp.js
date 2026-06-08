// Utility functions to display help messages for CLI commands
// These functions render available commands and their descriptions
// Used in CLI commands "Help" and "HelpMore"

// Column widths for alignment
const CMD_COL = 16
const SEP = "  "

// Pad command to fixed width, then add description
const formatCmd = (cmd, desc) => {
  const padded = cmd.padEnd(CMD_COL)
  return `${padded}${SEP}${desc}`
}

export const displayHelp = (setLogs) => {
  const mainCommands = [
    { cmd: "register",  desc: "Register a new account (interactive prompts)" },
    { cmd: "login",     desc: "Log in to an existing account (interactive prompts)" },
    { cmd: "logout",    desc: "Log out of the current account" },
    { cmd: "stats",     desc: "View your activity statistics" },
    { cmd: "ls",        desc: "List files in the current directory" },
    { cmd: "cd",        desc: "<directory> Navigate into a directory" },
    { cmd: "pwd",       desc: "Display the current directory path" },
    { cmd: "cat",       desc: "<filename>  Display the contents of a file" },
    { cmd: "open",      desc: "<name>      Open a project, game, or link" },
    { cmd: "echo",      desc: "<text>      Print text to the terminal" },
    { cmd: "clear",     desc: "Clear the terminal" },
    { cmd: "reboot",    desc: "Restart the terminal" },
    { cmd: "helpmore",  desc: "Show more commands" },
    { cmd: "help",      desc: "Show this message" },
  ]

  setLogs(prev => [...prev, <span className="text-blue-500">Available Commands:</span>])
  setLogs(prev => [...prev, <div>-------------------------------------------------</div>])
  mainCommands.forEach(({ cmd, desc }) => {
    setLogs(prev => [
      ...prev,
      <div>
        <span className="text-blue-500">{cmd.padEnd(CMD_COL)}</span>
        <span style={{ color: 'rgba(255,255,255,0.5)' }}>{SEP}</span>
        <span>{desc}</span>
      </div>
    ])
  })
}

export const displayHelpMore = (setLogs) => {
  const moreCommands = [
    { cmd: "hello",                   desc: "Greet me!" },
    { cmd: "whoami",                  desc: "Display the current user" },
    { cmd: "whoareyou",               desc: "Learn more about me" },
    { cmd: "version",                 desc: "Display the terminal version" },
    { cmd: "ps",                      desc: "List all running processes" },
    { cmd: "kill",                    desc: "<pid>     Terminate a process" },
    { cmd: "time",                    desc: "Display the current date/time" },
    { cmd: "magic8ball",              desc: "Ask the magic 8-ball a question" },
    { cmd: "coinflip",                desc: "Flip a coin" },
    { cmd: "d4",        desc: "Roll a 4-sided die" },
    { cmd: "d6",        desc: "Roll a 6-sided die" },
    { cmd: "d8",        desc: "Roll an 8-sided die" },
    { cmd: "d10",       desc: "Roll a 10-sided die" },
    { cmd: "d12",       desc: "Roll a 12-sided die" },
    { cmd: "d20",       desc: "Roll a 20-sided die" },
    { cmd: "joke",                    desc: "Tell a joke" },
    { cmd: "passwordgen",             desc: "Generate a password" },
    { cmd: "...",                     desc: "and more to discover!" },
  ]

  setLogs(prev => [...prev, <span className="text-blue-500">More Commands:</span>])
  setLogs(prev => [...prev, <div>-------------------------------------------------</div>])
  moreCommands.forEach(({ cmd, desc }) => {
    setLogs(prev => [
      ...prev,
      <div>
        <span className="text-blue-500">{cmd.padEnd(CMD_COL)}</span>
        <span style={{ color: 'rgba(255,255,255,0.5)' }}>{SEP}</span>
        <span>{desc}</span>
      </div>
    ])
  })
}