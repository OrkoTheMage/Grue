import { initDB } from "../../lib/mongodb"
import { createUser, findUserByName } from "../../models/User"

export default async function handler(req, res) {
  // Inital error checking
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  // No name or password error checking
  const { name, password } = req.body
  if (!name || !password) {
    return res.status(400).json({ error: "Name and password are required" })
  }

  const db = await initDB()
  console.log('Database connection established:', db)
  const existingUser = await findUserByName(db, name)
  
  // Username taken error checking
  if (existingUser) {
    return res.status(400).json({ error: "Username already taken" })
  }
  // Create the user successfully
  const userId = await createUser(db, { name, password })
  res.status(201).json({ message: "User created", userId })
}
