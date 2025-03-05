import { initDB } from "../../lib/mongodb"
import { validateUserPassword } from "../../models/User"

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
  const user = await validateUserPassword(db, name, password)
  
  // Invalid credentials error checking
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" })
  }
  // Successful login
  res.status(200).json({ message: "Login successful", userId: user._id })
}
