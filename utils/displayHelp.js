// Utility functions to display help messages for CLI commands
// These functions render available commands and their descriptions
// Used in CLI commands "Help" and "HelpMore"

// Helper function to render command entries
const renderCommands = (commands, setLogs) => {
  setLogs(prev => [
    ...prev,
    ...commands.map(cmd => (
      <>
        <span className="text-blue-500">{cmd.command}</span> <span>{cmd.description}</span>
      </>
    ))
  ]);
};

export const displayHelp = (setLogs) => {
  const mainCommands = [
    { command: "register", description: "<username> <password> - Register a new user" },
    { command: "login", description: "<username> <password> - Log in to an existing account" },
    { command: "stats", description: "- View your activity statistics" },
    { command: "ls", description: "- List files in the current directory" },
    { command: "cd", description: "<directory> - Change the current directory" },
    { command: "pwd", description: "- Display the current directory" },
    { command: "cat", description: "<filename> - Display the contents of a file" },
    { command: "echo", description: "<text> - Print text to the terminal" },
    { command: "run", description: "<game> - Launch a game" },
    { command: "clear", description: "- Clear the terminal logs" },
    { command: "logout", description: "- Log out of the current account" },
    { command: "reboot", description: "- Restart the terminal" },
    { command: "helpmore", description: "- Show more commands" },
    { command: "help", description: "- Show this helpful message" },
  ];

  setLogs(prev => [...prev, <span className="text-blue-500">Available Commands:</span>]);
  setLogs(prev => [...prev, <div>-------------------------------------------------</div>]);
  renderCommands(mainCommands, setLogs);
}

export const displayHelpMore = (setLogs) => {
  const moreCommands = [
    { command: "hello", description: "- Greet me!" },
    { command: "whoami", description: "- Display the current user" },
    { command: "whoareyou", description: "- Learn more about me" },
    { command: "version", description: "- Display the terminal version" },
    { command: "ps", description: "- List all running processes" },
    { command: "kill", description: "<pid> - Terminate a process" },
    { command: "time", description: "- Display the current date/time" },
    { command: "magic8ball", description: "- Ask the magic 8-ball a question" },
    { command: "coinflip", description: "- Flip a coin" },
    { command: "d20, d12, d10, d8, d6, d4", description: "- Roll a die" },
    { command: "joke", description: "- Tell a joke" },
    { command: "passwordgen", description: "- Generate a password" },
    { command: "...", description: "and more to discover!" },
  ];

  setLogs(prev => [...prev, <span className="text-blue-500">More Commands:</span>]);
  setLogs(prev => [...prev, <div>-------------------------------------------------</div>]);
  renderCommands(moreCommands, setLogs);
}