"use client"

import React, { useState } from "react"
import { login, LoginResponse } from "@/services/authService"

interface LoginFormProps {
	onSuccess?: (data: LoginResponse) => void
	redirectTo?: string
}

export default function LoginForm({ onSuccess, redirectTo }: LoginFormProps) {
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({})

	function validate() {
		const errs: { email?: string; password?: string } = {}
		if (!email) errs.email = "Email is required"
		else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Enter a valid email"
		if (!password) errs.password = "Password is required"
		else if (password.length < 6) errs.password = "Password must be at least 6 characters"
		setFieldErrors(errs)
		return Object.keys(errs).length === 0
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		setError(null)
		if (!validate()) return
		setLoading(true)
		try {
			const data = await login({ email, password })
			localStorage.setItem('authToken', data.token)
			setLoading(false)
			onSuccess?.(data)
			if (redirectTo) window.location.assign(redirectTo)
		} catch (err) {
			setError(err instanceof Error ? err.message : "Login failed")
			setLoading(false)
		}
	}

	return (
		<form onSubmit={handleSubmit} className="max-w-md w-full mx-auto p-6 bg-white rounded-md shadow-sm">
			<h2 className="text-lg font-medium mb-4">Sign in</h2>

			{error && <div className="text-sm text-red-600 mb-3">{error}</div>}

			<label className="block mb-3">
				<span className="text-sm">Email</span>
				<input
					type="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					className="mt-1 block w-full rounded border px-3 py-2"
					aria-invalid={!!fieldErrors.email}
				/>
				{fieldErrors.email && <div className="text-xs text-red-600 mt-1">{fieldErrors.email}</div>}
			</label>

			<label className="block mb-4">
				<span className="text-sm">Password</span>
				<input
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					className="mt-1 block w-full rounded border px-3 py-2"
					aria-invalid={!!fieldErrors.password}
				/>
				{fieldErrors.password && <div className="text-xs text-red-600 mt-1">{fieldErrors.password}</div>}
			</label>

			<button
				type="submit"
				className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60"
				disabled={loading}
			>
				{loading ? "Signing in…" : "Sign in"}
			</button>
		</form>
	)
}

