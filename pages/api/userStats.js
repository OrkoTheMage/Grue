import { initDB } from '../../lib/mongodb'
import { getUserStats, updateUserStat, getDiscoveredSecrets, recordDiscoveredSecret } from '../../models/userStats'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { operation, username, statType, secretName } = req.body
    
    if (!username) {
      return res.status(400).json({ error: "Missing username" })
    }

    const db = await initDB()
    
    // Handle different operations
    switch(operation) {
      case 'update':
        if (!statType) {
          return res.status(400).json({ error: "Missing statType for update operation" })
        }
        
        // Update the stat
        const success = await updateUserStat(db, username, statType)
        
        if (!success) {
          return res.status(404).json({ error: "User not found or invalid stat type" })
        }
        break;
      
      case 'discoverSecret':
        if (!secretName) {
          return res.status(400).json({ error: "Missing secretName for discoverSecret operation" })
        }
        
        const recorded = await recordDiscoveredSecret(db, username, secretName)
        
        // If already discovered, let the client know
        if (!recorded) {
          return res.status(200).json({ 
            success: true, 
            alreadyDiscovered: true,
            message: "Secret was already discovered" 
          })
        }
        break;
      
      case 'getSecrets':
        const secrets = await getDiscoveredSecrets(db, username)
        return res.status(200).json({ success: true, discoveredSecrets: secrets })
    }
    
    // For both get and update operations, return the current stats
    const stats = await getUserStats(db, username)
    
    if (!stats) {
      return res.status(404).json({ error: "User not found" })
    }
    
    return res.status(200).json({ success: true, stats })
  } catch (error) {
    console.error('Error handling user stats:', error)
    return res.status(500).json({ error: "Failed to process stats request" })
  }
}
