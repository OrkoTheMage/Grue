import { MongoClient } from 'mongodb'
import { getUserStats } from '../../models/User'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { username } = req.body
    
    if (!username) {
      return res.status(400).json({ error: "Missing username" })
    }

    const client = new MongoClient(process.env.MONGODB_URI)
    await client.connect()
    const db = client.db(process.env.MONGODB_DB)
    
    const stats = await getUserStats(db, username)
    await client.close()
    
    if (!stats) {
      return res.status(404).json({ error: "User not found" })
    }
    
    return res.status(200).json({ stats })
  } catch (error) {
    console.error('Error retrieving user stats:', error)
    return res.status(500).json({ error: "Failed to retrieve stats" })
  }
}
