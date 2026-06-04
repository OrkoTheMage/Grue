"use server"
import clientPromise from "./mongoclient"

const isDevelopment = process.env.NODE_ENV !== "production"

const getDatabaseName = () => {
  if (isDevelopment) {
    return process.env.MONGODB_DB_LOCAL || process.env.MONGODB_DB || "grue_local"
  }

  return process.env.MONGODB_DB_PRODUCTION || process.env.MONGODB_DB || "grue"
}

// Main function to connect to MongoDB
export const initDB = async () => {
  const client = await clientPromise
  const db = client.db(getDatabaseName())

  return db
}