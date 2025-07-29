const fileSystem = {
  '/': ['games', 'projects', 'contact'],
  '/games': ['In-Between', 'Sigil-The-City-of-Doors'],
  '/contact': ['Resume', 'GitHub'],
  '/projects': []
}

const fileContents = {
  '/games/in-between': 'A card game with unqiue rules.',
  '/games/sigil-the-city-of-doors': 'An adventure text game set in the multiverse nexus city of Sigil.',
  '/games/sigil': 'An adventure text game set in the multiverse nexus city of Sigil.',
  '/contact/resume': 'My professional resume with experience and skills.',
  '/contact/github': 'Link to my GitHub profile with various projects and contributions.'
}

const normalizeFileName = (filename) => {
  return filename.toLowerCase().replace(/-/g, '')
}

export const catFile = (fileName, currentDir, setLogs) => {
  if (fileName.toLowerCase() === 'sigil') {
    setLogs(prev => [
      ...prev,
      fileContents['/games/sigil']
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
      setLogs(prev => [
        ...prev,
        <div key="resume" className="pdf-container">
          <iframe 
            src="https://drive.google.com/file/d/1TsSomN2Mof_U2SNwRdYoZ_XIqZjguV5E/preview"
            width="100%"
            height="900px"
            title="Resume PDF"
            frameBorder="0"
          ></iframe>
        </div>
      ])
    } else if (currentDir === "/contact" && dir.toLowerCase() === "github") {
      window.open("https://github.com/OrkoTheMage", "_blank")
    } else {
      setLogs(prev => [...prev, `Directory '${dir}' not found.`])
    }
  }
}