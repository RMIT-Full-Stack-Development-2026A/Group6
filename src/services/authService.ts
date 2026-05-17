export interface LoginPayload {
  usernameOrEmail: string
  password: string
}

export interface SignupPayload {
  email: string
  password: string
  username: string
  country: string
}

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

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

export async function login(payload: LoginPayload): Promise<LoginResponse> {
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

  if (typeof window !== "undefined") {
    localStorage.setItem("authToken", data.token)
    localStorage.setItem("user", JSON.stringify(data.user))
  }

  return data
}

export async function logout(): Promise<void> { 
  if (typeof window === "undefined") return

  const token = localStorage.getItem("authToken")
  if (token) { 
    await fetch(`${API_BASE}/api/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }) 
  }

  localStorage.removeItem("authToken")
  localStorage.removeItem("user")
}

export async function signup(payload: SignupPayload): Promise<SignupResponse> {
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

  return data
}

export default {
  login,
  logout,
  signup,
}
