// Utility functions for user authentication and statistics
// These functions handle user registration, login, and statistics management
// Used in CLI commands and API interactions

export const registerUser = async (args, displayMsg) => {
  const name = args[0]
  const password = args[1]

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, password })
    })

    const data = await response.json()
    
    
    console.log("Server Response:", data) // 🔍 Log this to see the full error message
    console.log("HTTP Status:", response.status) // Check the status code

    if (!response.ok) {
      displayMsg(data.error)
      return
    }

    displayMsg(`Registered ${name} successfully.`)
  } catch (error) {
    displayMsg("Error: Registration failed.")
    console.error("Registration error:", error)
  }
}

export const loginUser = async (args, displayMsg, setCurrentUser) => {
  const name = args[0]
  const password = args[1]

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, password })
    })

    const data = await response.json()

    if (!response.ok) {
      displayMsg("Incorrect username or password.")
      return
    }

    displayMsg(`Welcome back, ${name}`)
    setCurrentUser(name)
    return data.user
  } catch (error) {
    displayMsg("Error: Login failed.")
    console.error("Login error:", error)
  }
}

export const updateUserStat = async (username, statType) => {
  if (!username) return false
  
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/userStats`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ operation: 'update', username, statType })
    })
    
    return response.ok
  } catch (error) {
    console.error("Error updating user stats:", error)
    return false
  }
}

export const getUserStatistics = async (username, displayMsg) => {
  if (!username) {
    displayMsg("You must be logged in to view stats.")
    return null
  }
  
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/userStats`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ operation: 'get', username })
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      displayMsg(data.error || "Failed to retrieve stats")
      return null
    }
    
    return data.stats
  } catch (error) {
    console.error("Error retrieving user stats:", error)
    displayMsg("Error retrieving stats")
    return null
  }
}

// New function to record a discovered secret
export const recordDiscoveredSecret = async (username, secretName) => {
  if (!username) return { success: false, reason: "Not logged in" }
  
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/userStats`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ operation: 'discoverSecret', username, secretName })
    })
    
    const data = await response.json()
    return { 
      success: response.ok, 
      alreadyDiscovered: data.alreadyDiscovered || false 
    }
  } catch (error) {
    console.error("Error recording discovered secret:", error)
    return { success: false, reason: "API error" }
  }
}

// New function to get all discovered secrets
export const getDiscoveredSecrets = async (username) => {
  if (!username) return null
  
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/userStats`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ operation: 'getSecrets', username })
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      return null
    }
    
    return data.discoveredSecrets || {}
  } catch (error) {
    console.error("Error getting discovered secrets:", error)
    return null
  }
}

