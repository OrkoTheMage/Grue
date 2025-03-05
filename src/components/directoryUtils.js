const fileSystem = {
  '/': ['games', 'projects', 'contact'],
  '/games': ['In-Between', 'Sigil-The-City-of-Doors'],
  '/contact': ['Resume', 'GitHub'],
  '/projects': []
}

export const listDirectory = (currentDir, setLogs) => {
  if (fileSystem[currentDir]) {
    setLogs(prev => [
      ...prev,
      <div>
        {fileSystem[currentDir].map((item, index) => (
          <span key={index} className="text-blue-500 mr-4">{item}</span>
        ))}
      </div>
    ])
  } else {
    setLogs(prev => [...prev, "No files or directories found."])
  }
}

export const changeDirectory = (args, currentDir, setCurrentDir, setLogs) => {
  const dir = args[0]
  
  if (!dir || dir === "cd") {
    setCurrentDir("/")
  } else if (dir === "..") {
    if (currentDir !== "/") {
      const parentDir = currentDir.substring(0, currentDir.lastIndexOf("/")) || "/"
      setCurrentDir(parentDir)
    }
  } else {
    const newPath = currentDir === "/" ? `/${dir}` : `${currentDir}/${dir}`
    
    if (fileSystem[newPath]) {
      setCurrentDir(newPath)
    } else if (currentDir === "/contact" && dir.toLowerCase() === "resume") {
      window.open("https://drive.google.com/file/d/1XuhPuQzuN8jNntMIOXAaqMQYS8f8B_tn/view?usp=sharing", "_blank")
    } else if (currentDir === "/contact" && dir.toLowerCase() === "github") {
      window.open("https://github.com/OrkoTheMage", "_blank")
    } else {
      setLogs(prev => [...prev, `Directory '${dir}' not found.`])
    }
  }
}