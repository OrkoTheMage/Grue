// Utility functions for user authentication and statistics
// These functions handle user registration, login, and statistics management
// Used in CLI commands and API interactions

export const registerUser = async (username, password, displayMsg) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: username, password })
    })

    const data = await response.json()

    if (!response.ok) {
      // Only surface "username taken" — mask all other errors
      if (response.status === 400 && data.error === "Username already taken") {
        displayMsg("Username already taken. Please choose a different one.")
      } else {
        displayMsg("Registration failed. Please try again.")
      }
      return
    }

    displayMsg(`Registered successfully. Welcome, ${username}!`)
    displayMsg("You can now log in with 'login <username>'.")
  } catch (error) {
    displayMsg("Error: Registration failed.")
    console.error("Registration error:", error)
  }
}

export const loginUser = async (username, password, displayMsg, setCurrentUser) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: username, password })
    })

    const data = await response.json()

    if (!response.ok) {
      // Generic error — never reveal whether username or password was wrong
      displayMsg("No matching username and password found.")
      return
    }

    displayMsg(`Welcome back, ${username}.`)
    setCurrentUser(username)
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

// Record a discovered secret
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

// Get all discovered secrets for a user
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
