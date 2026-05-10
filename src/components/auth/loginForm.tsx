"use client"

import React, { useState } from "react"

interface LoginFormProps {
	onSuccess?: (data: any) => void
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
			const res = await fetch("/api/auth/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password }),
			})
			const data = await res.json()
			if (!res.ok) {
				setError(data?.message || "Login failed")
				setLoading(false)
				return
			}
			setLoading(false)
			onSuccess?.(data)
			if (redirectTo) window.location.assign(redirectTo)
		} catch (err) {
			setError("Network error")
			setLoading(false)
		}
	}

	return (
		<form onSubmit={handleSubmit} className="max-w-md w-full mx-auto rounded-[1.5rem] border border-slate-200 bg-white p-7 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.15)]">
			<h2 className="text-2xl font-semibold mb-4 text-slate-900">Sign in</h2>

			{error && <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 mb-4">{error}</div>}

			<label className="block mb-3">
				<span className="text-sm font-medium text-slate-700">Email</span>
				<input
					type="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					className="mt-2 block w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-100"
					aria-invalid={!!fieldErrors.email}
				/>
				{fieldErrors.email && <div className="text-xs text-rose-600 mt-2">{fieldErrors.email}</div>}
			</label>

			<label className="block mb-5">
				<span className="text-sm font-medium text-slate-700">Password</span>
				<input
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					className="mt-2 block w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-100"
					aria-invalid={!!fieldErrors.password}
				/>
				{fieldErrors.password && <div className="text-xs text-rose-600 mt-2">{fieldErrors.password}</div>}
			</label>

			<button
				type="submit"
				className="w-full rounded-2xl bg-emerald-600 py-3 text-sm font-medium text-white shadow-sm shadow-emerald-500/20 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
				disabled={loading}
			>
				{loading ? "Signing in…" : "Sign in"}
			</button>
		</form>
	)
}

