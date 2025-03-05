export const listDirectory = (currentDir, setLogs) => {
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

export const changeDirectory = (dir, currentDir, setCurrentDir, setLogs) => {
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