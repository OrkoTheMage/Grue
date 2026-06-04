import { MongoClient } from 'mongodb'

const isDevelopment = process.env.NODE_ENV !== 'production'

const getMongoUri = () => {
  if (isDevelopment) {
    return process.env.MONGODB_URI_LOCAL || process.env.MONGODB_URI
  }

  return process.env.MONGODB_URI_PRODUCTION || process.env.MONGODB_URI
}

const uri = getMongoUri()
const options = { maxPoolSize: 10 }

let client
let clientPromise

if (!uri) {
  throw new Error('Please configure MongoDB with MONGODB_URI, MONGODB_URI_LOCAL, or MONGODB_URI_PRODUCTION')
}

if (isDevelopment) {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoClientPromise || global._mongoClientUri !== uri) {
    client = new MongoClient(uri, options)
    global._mongoClientPromise = client.connect()
    global._mongoClientUri = uri
    console.log('🔥 New mongodb connection')
  }
  clientPromise = global._mongoClientPromise
  // console.log('👍 Reusing mongodb connection')
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
  console.log('🔥 New mongodb connection')
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise