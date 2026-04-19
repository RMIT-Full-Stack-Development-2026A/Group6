"use client"

import React, { useState } from "react"
import { signup, SignupResponse } from "@/services/authService"

interface SignupFormProps {
    onSuccess?: (data: SignupResponse) => void
    redirectTo?: string
}

export default function SignupForm({ onSuccess, redirectTo }: SignupFormProps) {
    const [email, setEmail] = useState("")
    const [username, setUsername] = useState("")
    const [country, setCountry] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError(null)
        if (!email || !username || !country || !password) {
            setError("Email, username, country, and password are required")
            return
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match")
            return
        }
        setLoading(true)
        try {
            const data = await signup({ email, username, country, password })
            setLoading(false)
            onSuccess?.(data)
            if (redirectTo) window.location.assign(redirectTo)
        } catch (err) {
            setLoading(false)
            setError(err instanceof Error ? err.message : "Signup failed")
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <h2>Sign up</h2>
            {error && <div>{error}</div>}
            <label>
                Email
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
            <label>
                Username
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
            </label>
            <label>
                Country
                <select value={country} onChange={(e) => setCountry(e.target.value)}>
                    <option value="">Select a country</option>
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Australia">Australia</option>
                    <option value="Mexico">Vietnam</option>
                </select>
            </label>
            <label>
                Password
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </label>
            <label>
                Confirm password
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            </label>
            <button type="submit" disabled={loading}>
                {loading ? "Signing up…" : "Sign up"}
            </button>
        </form>
    )
}
