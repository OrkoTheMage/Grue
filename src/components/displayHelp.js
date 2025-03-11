export const displayHelp = (setLogs) => {
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
      <span className="text-blue-500">stats</span> <span>{"- View your activity statistics"}</span>
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

export const displayHelpMore = (setLogs) => {
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
      <span className="text-blue-500">passwordgen</span> <span>{"- Generate a password"}</span>
    </>,
    <>
      <span className="text-blue-500">...</span> <span>{"and more to discover!"}</span>
    </>,
  ])
}