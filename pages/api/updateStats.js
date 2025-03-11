import { MongoClient } from 'mongodb'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { username, statType } = req.body
    
    if (!username || !statType) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    const client = new MongoClient(process.env.MONGODB_URI)
    await client.connect()
    const db = client.db(process.env.MONGODB_DB)
    
    // Define valid stat types and their field names in the database
    const validStats = {
      'diceRolled': 'diceRolled',
      'magic8ballUsed': 'magic8ballUsed',
      'coinsFlipped': 'coinsFlipped',
      'gamesPlayed': 'gamesPlayed',
      'secretsFound': 'secretsFound'
    }
    
    if (!validStats[statType]) {
      await client.close()
      return res.status(400).json({ error: "Invalid stat type" })
    }
    
    // Create the update object with the appropriate field
    const updateField = {}
    updateField[`stats.${validStats[statType]}`] = 1
    
    // Update the user stats, incrementing the specific stat by 1
    const result = await db.collection('users').updateOne(
      { name: username },
      { $inc: updateField }
    )
    
    await client.close()
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "User not found" })
    }
    
    return res.status(200).json({ success: true })
  } catch (error) {
    console.error('Error updating user stats:', error)
    return res.status(500).json({ error: "Failed to update stats" })
  }
}
