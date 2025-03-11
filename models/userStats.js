"use server"

// Get user statistics
export const getUserStats = async (db, username) => {
  const user = await db.collection('users').findOne({ name: username })
  
  if (!user) {
    return null
  }
  
  // If stats object doesn't exist yet, create a default one
  if (!user.stats) {
    return {
      diceRolled: 0,
      magic8ballUsed: 0,
      coinsFlipped: 0,
      gamesPlayed: 0,
      secretsFound: 0
    }
  }
  
  return user.stats
}

// Function to update a specific user stat
export const updateUserStat = async (db, username, statType) => {
  const validStats = ['diceRolled', 'magic8ballUsed', 'coinsFlipped', 'gamesPlayed', 'secretsFound']
  
  if (!validStats.includes(statType)) {
    return false
  }
  
  const updateField = {}
  updateField[`stats.${statType}`] = 1
  
  const result = await db.collection('users').updateOne(
    { name: username },
    { $inc: updateField }
  )
  
  return result.matchedCount > 0
}

// Get user's discovered secrets
export const getDiscoveredSecrets = async (db, username) => {
  const user = await db.collection('users').findOne({ name: username })
  
  if (!user) {
    return null
  }
  
  return user.discoveredSecrets || {}
}

// Record a new discovered secret
export const recordDiscoveredSecret = async (db, username, secretName) => {
  // Check if the user has already discovered this secret
  const user = await db.collection('users').findOne({ name: username })
  if (!user) return false
  
  const discoveredSecrets = user.discoveredSecrets || {}
  
  // If secret was already discovered, return false (no need to update)
  if (discoveredSecrets[secretName]) return false
  
  // Mark the secret as discovered
  const updateField = {}
  updateField[`discoveredSecrets.${secretName}`] = true
  
  const result = await db.collection('users').updateOne(
    { name: username },
    { 
      $set: updateField,
      $inc: { 'stats.secretsFound': 1 } // Also increment the secretsFound counter
    }
  )
  
  return result.matchedCount > 0
}
