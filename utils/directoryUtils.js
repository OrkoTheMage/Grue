// Utility functions for directory and file management
// These functions handle file system operations like listing directories, changing directories, and reading files
// Used in CLI commands

const fileSystem = {
  '/': ['games', 'projects', 'contact'],
  '/games': ['in-between', 'sigil', 'venture'],
  '/contact': ['resume', 'github', 'contactinfo.md'],
  '/projects': ['js-presenter', 'cli-presenter', 'orkos-todo-tool']
}

// Directories that can actually be navigated into with 'cd'
const navigableDirectories = new Set(['/', '/games', '/projects', '/contact'])

const fileContents = {
  '/games/in-between': "A browser card game. Use 'open in-between' to view the game page.",
  '/games/sigil': "A text adventure set in the city of Sigil. Use 'open sigil' to view the game page.",
  '/games/venture': "A terminal-based RPG management game. Use 'open venture' to view the game page.",
  '/contact/resume': "My professional resume. Use 'open resume' to view it.",
  '/contact/github': "My GitHub profile. Use 'open github' to visit it.",
  '/projects/js-presenter': "A JavaScript-based presentation tool. Use 'open js-presenter' to view the project.",
  '/projects/cli-presenter': "A CLI-based presentation tool. Use 'open cli-presenter' to view the project.",
  '/projects/orkos-todo-tool': "A todo tool built by Orko. Use 'open orkos-todo-tool' to view the project.",
}

const normalizeFileName = (filename) => {
  return filename.toLowerCase().replace(/-/g, '')
}

// Returns true if the item in the given directory is a navigable subdirectory
const isNavigableDirectory = (currentDir, item) => {
  const path = currentDir === '/' ? `/${item}` : `${currentDir}/${item}`
  return navigableDirectories.has(path)
}

export const catFile = (fileName, currentDir, setLogs) => {
  if (fileName.toLowerCase() === 'sigil') {
    setLogs(prev => [
      ...prev,
      fileContents['/games/sigil']
    ])
    return
  }
  
  // Handle contactinfo.md specifically
  if (fileName.toLowerCase() === 'contactinfo.md' && currentDir === '/contact') {
    setLogs(prev => [
      ...prev,
      <div key="contactinfo">
        <div><span className="text-blue-500">Contact Information:</span></div>
        <div>-------------------------------------------------</div>
        <br />
        <div><span className="text-blue-500">Email:</span> aeryngrindle@gmail.com</div>
        <div><span className="text-blue-500">GitHub:</span> <a href="https://github.com/OrkoTheMage" target="_blank" rel="noopener noreferrer" className="underline">https://github.com/OrkoTheMage</a></div>
        <div><span className="text-blue-500">Phone:</span> (281) 759-2177</div>
      </div>
    ])
    return
  }
  
  const filePath = currentDir === '/' ? `/${fileName}` : `${currentDir}/${fileName}`
  
  if (fileContents[filePath]) {
    setLogs(prev => [
      ...prev,
      fileContents[filePath]
    ])
    return
  }
  
  const normalizedInput = normalizeFileName(fileName)
  
  if (fileSystem[currentDir]) {
    const fileMatch = fileSystem[currentDir].find(item => 
      normalizeFileName(item) === normalizedInput
    )
    
    if (fileMatch) {
      const matchedPath = currentDir === '/' ? `/${fileMatch}` : `${currentDir}/${fileMatch}`
      
      if (fileContents[matchedPath.toLowerCase()]) {
        setLogs(prev => [
          ...prev,
          fileContents[matchedPath.toLowerCase()]
        ])
        return
      }
    }
  }
  
  if (fileSystem[currentDir] && fileSystem[currentDir].some(item => 
    normalizeFileName(item) === normalizedInput)) {
    setLogs(prev => [...prev, `${fileName} is a directory or has no readable content.`])
  } else {
    setLogs(prev => [...prev, `File '${fileName}' not found.`])
  }
}

export const listDirectory = (currentDir, setLogs) => {
  if (fileSystem[currentDir]) {
    setLogs(prev => [
      ...prev,
      <div>
        {fileSystem[currentDir].map((item, index) => (
          <span
            key={index}
            className={`${isNavigableDirectory(currentDir, item) ? 'text-blue-500' : 'text-white'} mr-4`}
          >
            {item}
          </span>
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
    } else {
      // Check if it's a file-like item in the current directory
      const normalizedDir = dir.toLowerCase()
      const isKnownFile = fileSystem[currentDir]?.some(
        item => item.toLowerCase() === normalizedDir
      )

      if (isKnownFile) {
        setLogs(prev => [...prev, `'${dir}' is not a directory. Use 'open ${dir}' to open it.`])
      } else {
        setLogs(prev => [...prev, `Directory '${dir}' not found.`])
      }
    }
  }
}
