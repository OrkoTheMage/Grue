export const clearLogs = (setLogs, setInput) => {
  setLogs([])
  setInput("")
}

export const exitCli = (setLogs, setInput, setCurrentUser, currentUser) => {
  if (!currentUser) {
    setLogs(prev => [...prev, "You are not currently logged in."])
    return
  }

  setLogs(prev => [...prev, "Logging out"])

  let dotCount = 0
  const interval = setInterval(() => {
    dotCount += 1
    setLogs(prev => [
      ...prev.slice(0, prev.length - 1),
      `Logging out${'.'.repeat(dotCount)}`
    ])

    if (dotCount === 3) {
      clearInterval(interval)
      setCurrentUser(null)
      setInput("")
      setLogs(prev => [
        ...prev,
        "Logged out successfully.",
        "Restarting"
      ])

      let restartDotCount = 0
      const restartInterval = setInterval(() => {
        restartDotCount += 1
        setLogs(prev => [
          ...prev.slice(0, prev.length - 1),
          `Restarting${'.'.repeat(restartDotCount)}`
        ])

        if (restartDotCount === 5) {
          clearInterval(restartInterval)
          setTimeout(() => {
            window.location.reload()
          }, 1000)
        }
      }, 1000)
    }
  }, 1000)
}

export const generatePrompt = (currentUser) => {
  return currentUser
    ? <span className="text-green-400">{`${currentUser}@system:`}</span>
    : <span className="text-green-400">system:</span>
}
