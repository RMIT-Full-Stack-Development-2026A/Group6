"use client"

import React, { useState, useEffect } from "react"
import { registerUser, AdminCreateUserPayload } from "@/services/adminUserManagement.service"

interface RegisterPlayerFormProps {
  onClose: () => void
  onSuccess: () => void
}

export default function RegisterPlayerForm({ onClose, onSuccess }: RegisterPlayerFormProps) {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [country, setCountry] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null)
  const [dragging, setDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseUp = () => setDragging(false)
    window.addEventListener("mouseup", handleMouseUp)
    return () => window.removeEventListener("mouseup", handleMouseUp)
  }, [])

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    setDragging(true)
    const initialX = position?.x ?? window.innerWidth / 2 - 280
    const initialY = position?.y ?? window.innerHeight / 2 - 260
    setDragOffset({ x: event.clientX - initialX, y: event.clientY - initialY })
  }

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!dragging) return
    setPosition({ x: event.clientX - dragOffset.x, y: event.clientY - dragOffset.y })
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError(null)

    if (!username || !email || !country || !password || !confirmPassword) {
      setError("All fields are required.")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    setLoading(true)

    const payload: AdminCreateUserPayload = {
      username,
      email,
      password,
      country,
      role: "player",
      currentSubscription: null,
    }

    try {
      await registerUser(payload)
      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to register player")
    } finally {
      setLoading(false)
    }
  }

  const modalStyle = position
    ? { left: position.x, top: position.y, transform: "none", position: "absolute" as const }
    : { left: "50%", top: "50%", transform: "translate(-50%, -50%)", position: "absolute" as const }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 p-4">
      <div
        style={modalStyle}
        onMouseMove={handleMouseMove}
        className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl"
      >
        <div className="flex items-center justify-between mb-6 cursor-move" onMouseDown={handleMouseDown}>
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Register New Player</h2>
            <p className="text-sm text-slate-500">Create a new player account from the admin dashboard.</p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-900">Close</button>
        </div>

        {error && <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}

        <form onSubmit={handleSubmit} className="grid gap-4">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Username</span>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
              placeholder="Enter username"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
              placeholder="player@example.com"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Country</span>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            >
              <option value="">Select a country</option>
              <option value="United States">United States</option>
              <option value="Canada">Canada</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Australia">Australia</option>
              <option value="Mexico">Mexico</option>
              <option value="Vietnam">Vietnam</option>
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
              placeholder="Enter password"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Confirm Password</span>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
              placeholder="Repeat password"
            />
          </label>

          <div className="mt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Registering…" : "Register Player"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
