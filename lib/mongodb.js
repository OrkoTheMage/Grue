"use server"
import clientPromise from "./mongoclient"

// Main function to connect to MongoDB
export const initDB = async () => {
  const client = await clientPromise
  const db = client.db(process.env.NEXT_PUBLIC_ENV)

  return db
}