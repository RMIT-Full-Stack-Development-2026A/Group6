// Payload sent to the backend when a user attempts to log in.
export interface LoginPayload {
  usernameOrEmail: string
  password: string
}

// Payload sent to the backend when creating a new user account.
export interface SignupPayload {
  email: string
  password: string
  username: string
  country: string
}

// User data returned by the backend after successful authentication.
export interface User {
  id: string
  email: string
  username: string
  role: string
  subscription: boolean
  subscriptionExpires: string | null
}

export interface LoginResponse {
  user: User
  token: string
  message?: string
}

export type SignupResponse = LoginResponse

// Base backend URL used for auth-related API calls. Falls back to localhost for local development.
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  // Send login request to backend and parse the JSON response.
  const response = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data?.message || "Login failed")
  }

  // Persist token and user info in browser storage for session handling.
  if (typeof window !== "undefined") {
    sessionStorage.setItem("authToken", data.token)
    sessionStorage.setItem("user", JSON.stringify(data.user))
    localStorage.setItem("authToken", data.token)
    localStorage.setItem("user", JSON.stringify(data.user))
  }

  return data
}

export async function logout(): Promise<void> { 
  if (typeof window === "undefined") return

  // Notify backend to invalidate the current token, then clear local session storage.
  const token = sessionStorage.getItem("authToken")
  if (token) { 
    await fetch(`${API_BASE}/api/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }) 
  }

  sessionStorage.removeItem("authToken")
  sessionStorage.removeItem("user")
  localStorage.removeItem("authToken")
  localStorage.removeItem("user")
}

export async function signup(payload: SignupPayload): Promise<SignupResponse> {
  // Register a new user and return the created user/session token.
  const response = await fetch(`${API_BASE}/api/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data?.message || "Signup failed")
  }

  if (typeof window !== "undefined") {
    sessionStorage.setItem("authToken", data.token)
    sessionStorage.setItem("user", JSON.stringify(data.user))
    localStorage.setItem("authToken", data.token)
    localStorage.setItem("user", JSON.stringify(data.user))
  }

  return data
}

export default {
  login,
  logout,
  signup,
}
