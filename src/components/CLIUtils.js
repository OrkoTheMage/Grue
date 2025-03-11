export const clearLogs = (setLogs, setInput) => {
  setLogs([])
  setInput("")
}

export const animateDotsWithMessage = (message, maxDots, setLogs, onComplete, interval = 1000) => {
  let dotCount = 0
  const dotInterval = setInterval(() => {
    dotCount += 1
    setLogs(prev => [
      ...prev.slice(0, prev.length - 1),
      `${message}${'.'.repeat(dotCount)}`
    ])

    if (dotCount === maxDots) {
      clearInterval(dotInterval)
      if (onComplete) onComplete()
    }
  }, interval)
}

export const createIframe = (key, src, title) => {
  return (
    <div key={key} className="game-container relative">
      <iframe
        id={`iframe-${key}`}
        src={src}
        width="100%"
        height="900px"
        title={title}
        allow="fullscreen"
        frameBorder="0"
      ></iframe>
      <button
        className="fullscreen-btn absolute top-2 right-2 bg-gray-800 text-white px-3 py-1 rounded hover:bg-gray-700"
        title="Fullscreen"
        onClick={() => {
          const iframe = document.getElementById(`iframe-${key}`)
          if (iframe.requestFullscreen) {
            iframe.requestFullscreen()
          } else if (iframe.mozRequestFullScreen) {
            iframe.mozRequestFullScreen()
          } else if (iframe.webkitRequestFullscreen) {
            iframe.webkitRequestFullscreen()
          } else if (iframe.msRequestFullscreen) {
            iframe.msRequestFullscreen()
          }
        }}
      >
        ⛶
      </button>
    </div>
  )
}


export const exitCli = (setLogs, setInput, setCurrentUser, currentUser) => {
  if (!currentUser) {
    setLogs(prev => [...prev, "You are not currently logged in."])
    return
  }

  setLogs(prev => [...prev, "Logging out"])

  animateDotsWithMessage("Logging out", 3, setLogs, () => {
    setCurrentUser(null)
    setInput("")
    setLogs(prev => [
      ...prev,
      "Logged out successfully.",
      "Restarting"
    ])

    animateDotsWithMessage("Restarting", 5, setLogs, () => {
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    })
  })
}

export const generatePrompt = (currentUser) => {
  return currentUser 
    ? <span className="text-green-400">{`${currentUser}@system:`}</span>
    : <span className="text-green-400">system:</span>
}