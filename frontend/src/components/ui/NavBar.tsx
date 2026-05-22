"use client"

import Link from "next/link"
import React, { useEffect, useRef, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { logout } from "@/services/authService"
import { getProfile } from '@/services/userService'

export default function NavBar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [username, setUsername] = useState("")
  const [avatar, setAvatar] = useState<string | null>(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const isAdminPage = pathname?.startsWith("/admin")

  useEffect(() => {
    const token = localStorage.getItem("authToken")
    const user = localStorage.getItem("user")
    if (token && user) {
      setIsSignedIn(true)
      try {
        const parsed = JSON.parse(user)
        setUsername(parsed.username || "")
        // Attempt to get the freshest profile (may include avatar URL)
        getProfile()
          .then((full) => {
            setAvatar(full.profile?.avatar || null)
            setUsername(full.username || parsed.username || "")
          })
          .catch(() => {
            // fallback to stored user
            setAvatar((parsed as any).profile?.avatar || null)
          })
      } catch {
        setUsername("")
      }
    }
  }, [])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Listen for profile updates broadcasted elsewhere in the app
  useEffect(() => {
    function onProfileUpdated(e: Event) {
      const detail = (e as CustomEvent).detail as any
      if (detail) {
        setAvatar(detail.profile?.avatar || null)
        setUsername(detail.username || detail.username || username)
        setIsSignedIn(true)
      }
    }

    window.addEventListener('userProfileUpdated', onProfileUpdated as EventListener)
    return () => window.removeEventListener('userProfileUpdated', onProfileUpdated as EventListener)
  }, [username])

  if (isAdminPage) {
    return (
      <div className="w-full bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center">
            <div className="shrink-0 text-xl font-semibold text-black">
              <Link href="/">TicTacToang</Link>
            </div>
            <div className="flex-1 flex justify-center px-4">
              <div className="max-w-md w-full">
                <input
                  type="text"
                  placeholder="Search users, rooms, settings..."
                  className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-sm text-gray-700 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const homeHref = isSignedIn ? "/home" : "/"
  const pricingHref = isSignedIn ? "/subscription" : "/signup"

  async function handleLogout() {
    await logout()
    setIsSignedIn(false)
    setUsername("")
    setDropdownOpen(false)
    setMobileOpen(false)
    router.push("/")
  }

  return (
    <div className="w-full bg-white shadow-sm relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="shrink-0 text-xl font-semibold text-black">
            <Link href="/">TicTacToang</Link>
          </div>

          {/* Desktop nav */}
          <div className="hidden sm:flex sm:items-center space-x-4">
            <Link href={homeHref} className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100">Home</Link>
            <Link href="/gamemodes" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100">Game Modes</Link>
            <Link href={pricingHref} className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100">Pricing</Link>

            {isSignedIn ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  className="flex items-center justify-center w-9 h-9 rounded-full overflow-hidden bg-[#006948] text-white font-semibold text-sm hover:bg-[#005237] transition-colors focus:outline-none focus:ring-2 focus:ring-[#006948] focus:ring-offset-2"
                  aria-label="Profile menu"
                >
                  {avatar ? (
                    <img src={avatar} alt={username || 'User'} className="w-full h-full object-cover" />
                  ) : (
                    <span className="inline-block w-full h-full flex items-center justify-center">{username ? username.charAt(0).toUpperCase() : 'U'}</span>
                  )}
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-xs text-gray-500">Signed in as</p>
                      <p className="text-sm font-medium text-gray-800 truncate">{username}</p>
                    </div>
                    <Link href="/profile" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Profile</Link>
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">Sign out</button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100">Log in</Link>
                <Link href="/signup" className="px-4 py-2 rounded-xl text-sm font-medium text-white bg-[#006948] hover:bg-[#005237] transition-colors">Sign up</Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="sm:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
            aria-label="Open menu"
            onClick={() => setMobileOpen((prev) => !prev)}
          >
            {mobileOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="sm:hidden bg-white border-t border-gray-100 px-4 pb-4 space-y-1">
          <Link href={homeHref} onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100">Home</Link>
          <Link href="/gamemodes" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100">Game Modes</Link>
          <Link href={pricingHref} onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100">Pricing</Link>
          {isSignedIn ? (
            <>
              <Link href="/profile" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100">Profile ({username})</Link>
              <button onClick={handleLogout} className="block w-full text-left px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50">Sign out</button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100">Log in</Link>
              <Link href="/signup" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-md text-sm font-medium text-white bg-[#006948] rounded-xl text-center mt-2 hover:bg-[#005237] transition-colors">Sign up</Link>
            </>
          )}
        </div>
      )}
    </div>
  )
}