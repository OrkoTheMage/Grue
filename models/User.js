"use server"
import bcrypt from "bcrypt"

export const createUser = async (db, { name, password }) => {
  // Hash the password before storing it
  const saltRounds = 10
  const hashedPassword = await bcrypt.hash(password, saltRounds)

  // Create the user object with statistics fields
  const user = {
    name,
    password: hashedPassword, // Store the hashed password
    createdAt: new Date(),
    stats: {
      diceRolled: 0,
      magic8ballUsed: 0,
      coinsFlipped: 0,
      gamesPlayed: 0,
      secretsFound: 0
    },
    discoveredSecrets: {} // Object to track specific secrets that were discovered
  }

  const result = await db.collection("users").insertOne(user)
  return result.insertedId
}

export const findUserByName = async (db, name) => {
  return db.collection("users").findOne({ name })
}

export const validateUserPassword = async (db, name, password) => {
  const user = await findUserByName(db, name)
  if (!user) return null

  const isMatch = await bcrypt.compare(password, user.password)
  return isMatch ? user : null
}
