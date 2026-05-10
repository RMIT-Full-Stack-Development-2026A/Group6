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
        <form onSubmit={handleSubmit} className="max-w-md w-full mx-auto rounded-[1.5rem] border border-slate-200 bg-white p-7 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.15)]">
            <h2 className="text-2xl font-semibold mb-4 text-slate-900">Sign up</h2>
            {error && <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 mb-4">{error}</div>}
            <label className="block mb-4">

                <span className="text-sm font-medium text-slate-700">Email</span>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-2 block w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-100"
                />

            </label>
            <label className="block mb-4">
                <span className="text-sm font-medium text-slate-700">Username</span>
                <input 
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="mt-2 block w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-100"
                />
            </label>
            <label className="block mb-4">
                <span className="text-sm font-medium text-slate-700">Country</span>
                <select 
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="mt-2 block w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                >
                    <option value="">Select a country</option>
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Australia">Australia</option>
                    <option value="Mexico">Vietnam</option>
                </select>
            </label>
            <label className="block mb-4">
                <span className="text-sm font-medium text-slate-700">Password</span>
                <input 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-2 block w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-100"
                />
            </label> 
            <label className="block mb-5">
                <span className="text-sm font-medium text-slate-700">Confirm password</span>
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mt-2 block w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-100"
                />
            </label>
            <button 
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-emerald-600 py-3 text-sm font-medium text-white shadow-sm shadow-emerald-500/20 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
                {loading ? "Signing up…" : "Sign up"}
            </button>
        </form>
    )
}
