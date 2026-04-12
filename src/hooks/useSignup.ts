import { useCallback, useState } from "react"
import { signup, SignupPayload, SignupResponse } from "@/services/authService"

export function useSignup() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<SignupResponse | null>(null)

  const submit = useCallback(async (payload: SignupPayload) => {
    setLoading(true)
    setError(null)
    try {
      const data = await signup(payload)
      setUser(data)
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed")
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    submit,
    loading,
    error,
    user,
  }
}
