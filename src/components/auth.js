export const registerUser = async (args, displayMsg) => {
  const name = args[0]
  const password = args[1]

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, password })
    })

    const data = await response.json()
    
    
    console.log("Server Response:", data) // 🔍 Log this to see the full error message
    console.log("HTTP Status:", response.status) // Check the status code

    if (!response.ok) {
      displayMsg(data.error)
      return
    }

    displayMsg(`Registered ${name} successfully.`)
  } catch (error) {
    displayMsg("Error: Registration failed.")
    console.error("Registration error:", error)
  }
}

export const loginUser = async (args, displayMsg, setCurrentUser) => {
  const name = args[0]
  const password = args[1]

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, password })
    })

    const data = await response.json()

    console.log("Server Response:", data) // 🔍 Log this to see the full error message
    console.log("HTTP Status:", response.status) // Check the status code

    if (!response.ok) {
      displayMsg(data.message)
      return
    }

    displayMsg(`Welcome back, ${name}`)
    setCurrentUser(name)
    return data.user
  } catch (error) {
    displayMsg("Error: Login failed.")
    console.error("Login error:", error)
  }
}

