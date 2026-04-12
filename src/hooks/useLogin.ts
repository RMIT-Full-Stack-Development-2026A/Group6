import { useCallback, useState } from "react"
import { login, LoginPayload, LoginResponse } from "@/services/authService"

export function useLogin() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [user, setUser] = useState<LoginResponse | null>(null)

    const submit = useCallback(async (payload: LoginPayload) => {
        setLoading(true)
        setError(null)

        try {
            const data = await login(payload)
            setUser(data)
            return data
        } catch (err) {
            setError(err instanceof Error ? err.message : "Login failed")
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
